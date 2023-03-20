import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card } from "react-bootstrap";

export default function MyPurchases({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);
  const loadPurchasedItems = async () => {
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
    //Fetch metadata of each nft and add that to listedItem object.
    const purchases = await Promise.all(
      results.map(async (i) => {
        // fetch arguments from each result
        i = i.args;
        // get uri url from nft contract
        const totalPrice = await marketplace.getTotalPrice(i.itemId);
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
              price: i.price,
              itemId: i.itemId,
              name: metadata.name,
              description: metadata.description,
              image: metadata.image,
              document: metadata.document,
            };
          });

        return purchasedItem;
      })
    );
    setLoading(false);
    setPurchases(purchases);
  };
  useEffect(() => {
    loadPurchasedItems();
  }, []);
  if (loading)
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    );
  return (
    <div className="flex justify-center">
      {purchases.length > 0 ? (
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
                    <Card.Footer>
                      {ethers.utils.formatEther(item.totalPrice)} ETH
                    </Card.Footer>
                  </a>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No purchases</h2>
        </main>
      )}
    </div>
  );
}
