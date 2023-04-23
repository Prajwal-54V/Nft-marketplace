import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import LoginBtn from "./LoginBtn";
import axios from "axios";

const Home = ({ marketplace, nft, loggedIn, setLoginBtn, account, user }) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const alert = useAlert();
  const naviagate = useNavigate();
  useEffect(() => {
    loadMarketplaceItems();
  }, []);
  const loadMarketplaceItems = async () => {
    // Load all unsold items
    const itemCount = await marketplace.itemCount();
    // console.log(itemCount);

    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i);

      if (!item.sold) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(item.tokenId);
        const totalPrice = await marketplace.getTotalPrice(item.itemId);
        // use uri to fetch the nft metadata stored on ipfs
        var tt = `https://${uri}`;

        const res = await fetch(tt)
          .then((res) => res.json())
          .then((metadata) => {
            items.push({
              totalPrice,
              itemId: item.itemId,
              seller: item.seller,
              name: metadata.name,
              description: metadata.description,
              image: metadata.image,
              tokenId: item.tokenId,
            });
            // console.log(items);
            setItems(items);
          });
      }
    }
    setLoading(false);
    setItems(items);
  };

  const buyMarketItem = async (item) => {
    try {
      await (
        await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })
      ).wait();
      const response = await axios.put(
        `http://localhost:4000/properties/${item.tokenId}`,
        { isSold: true, user: user, tokenId: item.tokenId }
      );

      loadMarketplaceItems();

      if (response.status === 200) {
        alert.show(
          "Property purchsed for " + ethers.utils.formatEther(item.totalPrice)
        );
        naviagate("/my-listed-items");
      }
    } catch (err) {
      console.log(err);
      alert.error("failed to buy property");
    }
  };

  if (!loggedIn) return <LoginBtn setLoginBtn={setLoginBtn} />;

  if (loading)
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    );
  return (
    <div className="flex justify-center">
      {items.length > 0 ? (
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={`https://${item.image}`} />
                  <Card.Body color="secondary">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>{item.description}</Card.Text>
                  </Card.Body>
                  {item.seller.toLowerCase() !== account && (
                    <Card.Footer>
                      <div className="d-grid">
                        <Button
                          onClick={() => buyMarketItem(item)}
                          variant="primary"
                          size="lg"
                        >
                          Buy for {ethers.utils.formatEther(item.totalPrice)}{" "}
                          ETH
                        </Button>
                      </div>
                    </Card.Footer>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No listed assets</h2>
        </main>
      )}
    </div>
  );
};
export default Home;
