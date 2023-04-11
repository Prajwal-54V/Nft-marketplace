import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card } from "react-bootstrap";
import LoginBtn from "./LoginBtn";
import axios from "axios";
import { useAlert } from "react-alert";
import { client, subdomain } from "../../constants/IPFS";

function renderSoldItems(items) {
  return (
    <>
      <h2>Sold</h2>
      <Row xs={1} md={2} lg={4} className="g-4 py-3">
        {items.map((item, idx) => (
          <Col key={idx} className="overflow-hidden">
            <Card>
              <Card.Img variant="top" src={`https://${item.image}`} />
              <Card.Footer>
                For {ethers.utils.formatEther(item.totalPrice)} ETH - Recieved{" "}
                {ethers.utils.formatEther(item.price)} ETH
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
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
  const alert = useAlert();
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
      mintThenList(result, data.price);
    } catch (error) {
      console.log("ipfs uri upload error: ", error);
    }
  };
  const mintThenList = async (result, price) => {
    console.log(result, price);
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
    alert.show("property listed successfully!");
  };

  const listProperty = async (property) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/properties/${property._id}`,
        { isListed: true }
      );
      if (response.status === 200) {
        createNFT(response.data);
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
    } catch (err) {
      console.log(err);
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
    loadApprovedProperty();
    setLoading(false);
    // setListedItems(listedItems);
    setSoldItems(soldItems);
  };
  useEffect(() => {
    loadSoldProperties();
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
          <h2>Listed Property</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Is Approved</th>
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

          {soldItems.length > 0 && renderSoldItems(soldItems)}
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No listed assets</h2>
        </main>
      )}
    </div>
  );
}
