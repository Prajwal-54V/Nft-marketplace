import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./Navbar";
import Home from "./Home.js";
import Create from "./Create.js";
import MyListedItems from "./MyListedItems.js";
import MyPurchases from "./MyPurchases.js";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import LoginBtn from "./LoginBtn";
import MarketplaceAbi from "../contractsData/Marketplace.json";
import MarketplaceAddress from "../contractsData/Marketplace-address.json";
import NFTAbi from "../contractsData/NFT.json";
import NFTAddress from "../contractsData/NFT-address.json";
import { useState } from "react";
import { ethers } from "ethers";
import { Button, Spinner } from "react-bootstrap";

import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginBtn, setLoginBtn] = useState(true);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [nft, setNFT] = useState({});
  const [marketplace, setMarketplace] = useState({});
  const [user, setUser] = useState("");

  // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);

    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const temp = await provider.getBalance(accounts[0]);
    setBalance(ethers.utils.formatEther(temp));

    // Set signer
    const signer = provider.getSigner();

    window.ethereum.on("chainChanged", (chainId) => {
      window.location.reload();
    });

    window.ethereum.on("accountsChanged", async function (accounts) {
      setAccount(accounts[0]);
      await web3Handler();
    });
    loadContracts(signer);
  };
  const loadContracts = async (signer) => {
    // Get deployed copies of contracts
    const marketplace = new ethers.Contract(
      MarketplaceAddress.address,
      MarketplaceAbi.abi,
      signer
    );
    setMarketplace(marketplace);
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
    setNFT(nft);
    setLoading(false);
  };
  return (
    <BrowserRouter>
      <div className="App">
        <>
          <Navigation
            web3Handler={web3Handler}
            account={account}
            balance={balance}
            user={user}
          />
        </>
        <>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "80vh",
              }}
            >
              <Spinner animation="border" style={{ display: "flex" }} />
              <p className="mx-3 my-0">Awaiting Metamask Connection...</p>
            </div>
          ) : loginBtn ? (
            <LoginBtn setLoginBtn={setLoginBtn} />
          ) : (
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    marketplace={marketplace}
                    nft={nft}
                    loggedIn={loggedIn}
                    setLoginBtn={setLoginBtn}
                  />
                }
              />
              <Route
                path="/create"
                element={
                  <Create
                    marketplace={marketplace}
                    nft={nft}
                    loggedIn={loggedIn}
                    setLoginBtn={setLoginBtn}
                  />
                }
              />
              <Route
                path="/my-listed-items"
                element={
                  <MyListedItems
                    marketplace={marketplace}
                    nft={nft}
                    account={account}
                    loggedIn={loggedIn}
                    setLoginBtn={setLoginBtn}
                  />
                }
              />
              <Route
                path="/my-purchases"
                element={
                  <MyPurchases
                    marketplace={marketplace}
                    nft={nft}
                    account={account}
                    loggedIn={loggedIn}
                    setLoginBtn={setLoginBtn}
                  />
                }
              />
              <Route
                path="/login"
                element={
                  <LoginForm setLoggedIn={setLoggedIn} setUser={setUser} />
                }
              />
              <Route
                path="/signup"
                element={
                  <SignupForm
                    setLoggedIn={setLoggedIn}
                    account={account}
                    setUser={setUser}
                  />
                }
              />
            </Routes>
          )}
        </>
      </div>
    </BrowserRouter>
  );
}

export default App;
