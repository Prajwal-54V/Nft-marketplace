import { useState, useEffect } from "react";
import { ethers } from "ethers";
import LoginBtn from "./LoginBtn";
import axios from "axios";
import { useAlert } from "react-alert";
import { client, subdomain } from "../../constants/IPFS";
import { useNavigate } from "react-router-dom";
import LoaderAnimation2 from "./LoaderAnimation2";

function renderSoldItems(items) {
  return (
    <>
      {items.length > 0 && (
        <div className="card-container">
          <header className="home-brand">
            <h2>Sold Properties</h2>
          </header>
          <div className="card-box">
            {items.map((item, idx) => (
              <div className="card" key={idx}>
                <img
                  src={`https://${item.image}`}
                  alt="property"
                  className="card__image"
                />
                <div className="card__content">
                  <h2 className="card__title">{item.name}</h2>
                  <p className="card__description">{item.description}</p>
                  <div className="card__footer">
                    <span className="card__sold__description">
                      Sold For {ethers.utils.formatEther(item.totalPrice)} ETH -
                      Recieved {ethers.utils.formatEther(item.price)} ETH
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
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
    <>
      {purchases.length > 0 && (
        <div className="card-container">
          <header className="home-brand">
            <h2>Purchased Properties</h2>
          </header>
          <div className="card-box">
            {purchases.map((item, idx) => (
              <div className="card" key={idx}>
                <a
                  href={`https://${item.document}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={`https://${item.image}`}
                    alt="property"
                    className="card__image"
                  />
                </a>
                <div className="card__content">
                  <h2 className="card__title">{item.name}</h2>
                  <p className="card__description">{item.description}</p>
                  {item.sold ? (
                    <div className="card__sold__description">
                      Purchased For {ethers.utils.formatEther(item.totalPrice)}{" "}
                      ETH
                    </div>
                  ) : (
                    <div className="card__sold__description">
                      Listed For {ethers.utils.formatEther(item.totalPrice)} ETH
                    </div>
                  )}
                  {item.sold && (
                    <div>
                      <div className="card__footer">
                        {resell === idx ? (
                          <>
                            <div className="card__footer_row">
                              <input
                                onChange={(e) => {
                                  setNewPrice(e.target.value);
                                }}
                                required
                                type="number"
                                placeholder="Price in ETH"
                              />
                            </div>
                            <div className="card__footer_row">
                              <button
                                className="card__footer__button"
                                onClick={() => {
                                  resellProperty(item);
                                }}
                              >
                                Resell
                              </button>
                              <button
                                className="card__footer__button"
                                onClick={() => toggleResell(-1)}
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <button
                            className="card__button"
                            onClick={() => {
                              toggleResell(idx);
                            }}
                          >
                            Resell Property
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
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
      const userProperties = await axios.get(
        `http://localhost:4000/properties/${user._id}`
      );

      const userPropertyTokens = [];
      userProperties.data.forEach((prop) => {
        if (prop.tokenId !== null) userPropertyTokens.push(prop.tokenId);
      });

      if (userProperties.data.length > 0) {
        //Fetch metadata of each nft and add that to listedItem object.
        const purchases = await Promise.all(
          results.map(async (i) => {
            i = i.args;

            const exists = userPropertyTokens.some(
              (element) => element.hex === i.tokenId._hex
            );
            console.log(exists);
            if (exists === false) return;
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
          if (item === undefined) return false;
          return (
            index ===
            self.findIndex((otherItem) => {
              return JSON.stringify(otherItem) === JSON.stringify(item);
            })
          );
        });

        setPurchases(uniquePurchases);
        // console.log(uniquePurchases);
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
        <LoaderAnimation2 />
      </main>
    );

  return (
    <div className="dashboard-main-container">
      <div className="dashboard-container">
        <header className="dashboard-brand">
          <h2>Listed Property</h2>
        </header>

        {listedItems.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <div className="row-head">
                  <div className="row-head-col">Document</div>
                  <div className="row-head-col">Status</div>
                  <div className="row-head-col">Action</div>
                </div>
              </tr>
            </thead>
            <tbody>
              <div className="table-body">
                {listedItems.map((property) => (
                  <div key={property._id}>
                    <div className="row">
                      <div className="row-body-col">
                        <a
                          href={`https://${property.document}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {property._id}
                        </a>
                      </div>
                      <div className="row-body-col">
                        {property.isApproved ? (
                          <span className="greenn">Approved</span>
                        ) : (
                          <span className="redd">Not Approved</span>
                        )}
                      </div>
                      <div className="row-body-col">
                        {property.isApproved ? (
                          !property.isListed ? (
                            <>
                              <button
                                className="buttons"
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </tbody>
          </table>
        ) : (
          <main style={{ padding: "1rem 0" }}></main>
        )}
      </div>
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
