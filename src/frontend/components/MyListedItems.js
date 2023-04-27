import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card, Form } from "react-bootstrap";
import LoginBtn from "./LoginBtn";
import axios from "axios";
import { useAlert } from "react-alert";
import { client, subdomain } from "../../constants/IPFS";
import { useNavigate } from "react-router-dom";

function renderSoldItems(items) {
  return (
    <div className="flex justify-center">
      {items.length > 0 ? (
        <>
          <h2>Sold</h2>
          <div className="px-5 container">
            <Row xs={1} md={2} lg={4} className="g-4 py-3">
              {items.map((item, idx) => (
                <Col key={idx} className="overflow-hidden">
                  <Card>
                    <Card.Img variant="top" src={`https://${item.image}`} />
                    <Card.Footer>
                      For {ethers.utils.formatEther(item.totalPrice)} ETH -
                      Recieved {ethers.utils.formatEther(item.price)} ETH
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          {/* <h5>No sold properties</h5> */}
        </main>
      )}
    </div>
  );
}
function renderPurchases(
  purchases,
  resell,
  toggleResell,
  setNewPrice,
  resellProperty
) {
  return (
    <div className="flex justify-center">
      {purchases.length > 0 ? (
        <>
          <h2>purchased</h2>
          <div className="px-5 container">
            <Row xs={1} md={2} lg={4} className="g-4 py-5">
              {purchases.map((item, idx) => (
                <Col key={idx} className="overflow-hidden">
                  <Card>
                    <a
                      href={`https://${item.document}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Card.Img variant="top" src={`https://${item.image}`} />
                      {item.sold ? (
                        <Card.Subtitle className="my-1">
                          purchased for{" "}
                          {ethers.utils.formatEther(item.totalPrice)} ETH
                        </Card.Subtitle>
                      ) : (
                        <Card.Subtitle className="my-1">
                          listed for {ethers.utils.formatEther(item.totalPrice)}{" "}
                          ETH
                        </Card.Subtitle>
                      )}
                    </a>
                    {item.sold && (
                      <Card.Footer className="d-flex flex-column justify-content-evenly">
                        {resell === idx ? (
                          <>
                            <Row className="my-2">
                              <Form.Control
                                onChange={(e) => {
                                  setNewPrice(e.target.value);
                                }}
                                required
                                type="number"
                                placeholder="Price in ETH"
                              />
                            </Row>
                            <div className="d-flex flex-row">
                              <button
                                className="btn btn-success w-50"
                                onClick={() => {
                                  resellProperty(item);
                                }}
                              >
                                Resell
                              </button>
                              <button
                                className="btn btn-secondary w-50"
                                onClick={() => toggleResell(-1)}
                              >
                                cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <button
                            className="btn btn-success"
                            onClick={() => {
                              toggleResell(idx);
                            }}
                          >
                            Resell Property
                          </button>
                        )}
                      </Card.Footer>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </>
      ) : (
        <main style={{ padding: "1rem 0" }}>{/* <h5></h5> */}</main>
      )}
    </div>
  );
}

export default function MyListedItems({
  marketplace,
  nft,
  account,
  loggedIn,
  setLoginBtn,
  user,
}) {
  const [loading, setLoading] = useState(true);
  const [listedItems, setListedItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [newPrice, setNewPrice] = useState(0);
  const [resell, toggleResell] = useState(-1);
  const alert = useAlert();
  const navigate = useNavigate();
  const resellProperty = async (property) => {
    try {
      if (property !== undefined || property !== null) {
        const listingPrice = ethers.utils.parseEther(newPrice.toString());
        await (await nft.setApprovalForAll(marketplace.address, true)).wait();

        await (
          await marketplace.relistItem(
            nft.address,
            property.itemId,
            property.tokenId,
            listingPrice
          )
        ).wait();

        const response = await axios.post(
          "http://localhost:4000/updateProperty",
          {
            isSold: false,
            newPrice,
            tokenId: property.tokenId,
          }
        );
        if (response.status === 200) {
          alert.show("Property Listed");
          navigate("/");
        } else {
          throw new Error("failed to update property");
        }
      }
    } catch (err) {
      console.log(err);
      alert.show("failed whiled reselling property");
      navigate("/my-listed-items");
    }
  };

  const loadPurchasedItems = async () => {
    try {
      // Fetch purchased items from marketplace by quering Offered events with the buyer set as the user
      const filter = marketplace.filters.Bought(
        null,
        null,
        null,
        null,
        null,
        account
      );
      const results = await marketplace.queryFilter(filter);
      const response = await axios.get(
        `http://localhost:4000/properties/${user._id}`
      );
      const userPropertyTokens = [];
      // response.data.forEach((prop) => {
      //   userPropertyTokens.push(prop.tokenId);
      // });

      // const results = res.filter((item) =>
      //   userPropertyTokens.includes(item.args.tokenId)
      // );
      // const results = res.filter((item) => {
      //   return userPropertyTokens.some((otherItem) => {
      //     return item._hex === otherItem.hex;
      //   });
      // });

      // console.log(userPropertyTokens[0]);
      // console.log(res[0].args.tokenId);

      if (response.data.length > 0) {
        //filter user properties

        //Fetch metadata of each nft and add that to listedItem object.
        const purchases = await Promise.all(
          results.map(async (i) => {
            // fetch arguments from each result
            i = i.args;

            // get uri url from nft contract
            const totalPrice = await marketplace.getTotalPrice(i.itemId);
            const isSold = await marketplace.isItemSold(i.itemId);
            const uri = await nft.tokenURI(i.tokenId);

            var tt = `https://${uri}`;
            let purchasedItem = "";

            // use uri to fetch the nft metadata stored on ipfs
            const response = await fetch(tt)
              .then((res) => res.json())
              .then((metadata) => {
                // define listed item object

                purchasedItem = {
                  totalPrice,
                  // price: i.price,
                  itemId: i.itemId,
                  name: metadata.name,
                  description: metadata.description,
                  image: metadata.image,
                  document: metadata.document,
                  tokenId: i.tokenId,
                  sold: isSold,
                };
              });

            return purchasedItem;
          })
        );

        const uniquePurchases = purchases.filter((item, index, self) => {
          return (
            index ===
            self.findIndex((otherItem) => {
              return JSON.stringify(otherItem) === JSON.stringify(item);
            })
          );
        });

        setPurchases(uniquePurchases);
      } else {
        throw new Error("failed to fetch properties");
      }
    } catch (err) {
      console.log(err);
      // alert.error("failed load purchased items");
    }
  };

  const createNFT = async (data) => {
    try {
      const property = JSON.stringify({
        image: data.image,
        document: data.document,
        price: data.price,
        location: data.location,
        description: data.description,
        user: data.user,
      });

      const result = await client.add(property);
      return await mintThenList(result, data.price);
    } catch (error) {
      console.log("ipfs uri upload error: ", error);
      return false;
    }
  };
  const mintThenList = async (result, price) => {
    try {
      // console.log(result, price);
      const uri = `${subdomain}/ipfs/${result.path}`;
      // mint nft

      await (await nft.mint(uri)).wait();

      // get tokenId of new nft
      const id = await nft.tokenCount();

      // approve marketplace to spend nft
      await (await nft.setApprovalForAll(marketplace.address, true)).wait();
      // add nft to marketplace
      const listingPrice = ethers.utils.parseEther(price.toString());
      // console.log("nft address", nft.address);

      await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();

      return id;
    } catch (err) {
      console.log(err);
    }
  };

  const listProperty = async (property) => {
    try {
      const id = await createNFT(property);

      const response = await axios.put(
        `http://localhost:4000/properties/${property._id}`,
        { isListed: true, tokenId: id }
      );
      if (response.status === 200) {
        alert.show("Property listed");
      } else {
        throw new Error("failed to list property");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const loadApprovedProperty = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/properties/${user._id}`
      );
      setListedItems(response.data);

      await loadSoldProperties();
      setLoading(false);
    } catch (err) {
      console.log(err);
      alert.info("error while fetching your property details");
    }
  };

  const loadSoldProperties = async () => {
    // Load all sold items that the user listed
    const itemCount = await marketplace.itemCount();
    // let listedItems = [];
    let soldItems = [];

    for (let indx = 1; indx <= itemCount; indx++) {
      const i = await marketplace.items(indx);

      if (i.seller.toLowerCase() === account) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(i.tokenId);
        // use uri to fetch the nft metadata stored on ipfs

        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(i.itemId);
        // define listed item object
        var tt = `https://${uri}`;
        // console.log(i.sold);
        const response = await fetch(tt)
          .then((res) => res.json())
          .then((metadata) => {
            let item = {
              totalPrice,
              price: i.price,
              itemId: i.itemId,
              name: metadata.name,
              description: metadata.description,
              image: metadata.image,
            };
            // listedItems.push(item);
            // Add listed item to sold items array if sold

            if (i.sold) soldItems.push(item);
          });
      }
    }

    await loadPurchasedItems();
    setSoldItems(soldItems);
  };
  useEffect(() => {
    // loadSoldProperties();
    loadApprovedProperty();
  }, []);
  if (!loggedIn) return <LoginBtn setLoginBtn={setLoginBtn} />;
  if (loading)
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    );

  return (
    <div className="flex justify-center">
      {listedItems.length > 0 ? (
        <div className="px-5 py-3 container">
          <h4>Listed Property</h4>
          <table className="table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {listedItems.map((property) => (
                <tr key={property._id}>
                  <td>
                    <a
                      href={`https://${property.document}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {property._id}
                    </a>
                  </td>
                  <td>{property.isApproved ? "Approved" : "Not Approved"}</td>
                  <td>
                    {property.isApproved ? (
                      !property.isListed ? (
                        <>
                          <button
                            className="btn btn-success mr-2"
                            onClick={() => listProperty(property)}
                          >
                            list property
                          </button>
                        </>
                      ) : (
                        <div>property listed</div>
                      )
                    ) : (
                      <div>waiting for approval</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          {/* <h5>No listed assets</h5> */}
        </main>
      )}
      {renderPurchases(
        purchases,
        resell,
        toggleResell,
        setNewPrice,
        resellProperty
      )}
      {renderSoldItems(soldItems)}
    </div>
  );
}
