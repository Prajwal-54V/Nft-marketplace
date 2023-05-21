import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import LoginBtn from "./LoginBtn";
import axios from "axios";
import LoaderAnimation2 from "./LoaderAnimation2";

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
        <LoaderAnimation2 />
      </main>
    );
  return (
    <div className="card-container">
      <header className="home-brand">
        <h2>Properties</h2>
      </header>
      <div className="card-box">
        {items.length > 0 && (
          <>
            {items.map((item, idx) => (
              <div className="card" key={idx}>
                {console.log(item.image)}
                <img
                  src={`https://${item.image}`}
                  alt="property"
                  className="card__image"
                />
                <div className="card__content">
                  <h2 className="card__title">{item.name}</h2>
                  <p className="card__description">{item.description}</p>
                  {item.seller.toLowerCase() !== account && (
                    <div>
                      <button
                        className="card__button"
                        onClick={() => buyMarketItem(item)}
                      >
                        Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
export default Home;
