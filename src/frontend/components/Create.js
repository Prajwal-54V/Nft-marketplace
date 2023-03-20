import { useState } from "react";
import { ethers } from "ethers";
import { Row, Form, Button } from "react-bootstrap";
import { Buffer } from "buffer";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const projectId = "2N9f5AoKdaMwTOFrSPrrpS7TRxb";
const projectSecret = "949476f7567516616a806fd4d06c2a88";
const subdomain = "realestateproject.infura-ipfs.io";
// Pay attentnion at the space between Basic and the $ in the next line
// encrypt the authorization
const authorization = `Basic ${Buffer.from(
  `${projectId}:${projectSecret}`
).toString("base64")}`;

const client = ipfsHttpClient({
  host: "infura-ipfs.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: authorization,
  },
});

const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState("");
  const [document, setDocument] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const alert = useAlert();
  const navigate = useNavigate();

  //
  const uploadToIPFS = async (event, type) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (typeof file !== "undefined") {
      try {
        const result = await client.add(file);

        if (type === "doc") {
          setDocument(`${subdomain}/ipfs/${result.path}`);
        } else if (type === "img") setImage(`${subdomain}/ipfs/${result.path}`);
      } catch (error) {
        console.log("ipfs Document upload error: ", error);
      }
    }
  };
  // application / pdf;
  // image/png

  const createNFT = async () => {
    if (!image || !price || !location || !description || !document) return;
    try {
      const result = await client.add(
        JSON.stringify({ image, document, price, location, description })
      );

      mintThenList(result);
    } catch (error) {
      console.log("ipfs uri upload error: ", error);
    }
  };
  const mintThenList = async (result) => {
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
    navigate("/");
  };
  return (
    <div className=" mt-5">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 mx-auto"
          style={{ maxWidth: "1000px" }}
        >
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Group controlId="propertyDocument" className="d-flex">
                <Form.Label style={{ width: "100px" }}>Document:</Form.Label>
                <Form.Control
                  type="file"
                  className=""
                  onChange={(e) => uploadToIPFS(e, "doc")}
                />
              </Form.Group>
              <Form.Group controlId="propertyImage" className="d-flex">
                <Form.Label style={{ width: "100px" }}>Image:</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => uploadToIPFS(e, "img")}
                  className=""
                />
              </Form.Group>
              <Form.Control
                onChange={(e) => setLocation(e.target.value)}
                size="lg"
                required
                type="text"
                placeholder="location"
              />
              <Form.Control
                onChange={(e) => setDescription(e.target.value)}
                size="lg"
                required
                as="textarea"
                placeholder="Description"
              />
              <Form.Control
                onChange={(e) => setPrice(e.target.value)}
                size="lg"
                required
                type="number"
                placeholder="Price in ETH"
              />

              <Button onClick={createNFT} variant="primary" type="submit">
                List Property
              </Button>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Create;
