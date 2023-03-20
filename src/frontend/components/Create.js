import { useState } from "react";
import { ethers } from "ethers";
import { Row, Form, Button } from "react-bootstrap";
import { Buffer } from "buffer";
import { create as ipfsHttpClient } from "ipfs-http-client";
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
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (typeof file !== "undefined") {
      try {
        const result = await client.add(file);
        setImage(`${subdomain}/ipfs/${result.path}`);
      } catch (error) {
        console.log("ipfs Document upload error: ", error);
      }
    }
  };
  // application / pdf;
  // image/png

  const uploadToDB = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (typeof file !== "undefined") {
      try {
      } catch (error) {
        console.log("DB image upload error: ", error);
      }
    }
  };
  const createNFT = async () => {
    if (!image || !price || !location || !description) return;
    try {
      const result = await client.add(
        JSON.stringify({ image, price, location, description })
      );
      // console.log(result);
      mintThenList(result);
    } catch (error) {
      console.log("ipfs uri upload error: ", error);
    }
  };
  const mintThenList = async (result) => {
    // const uri = `https://ipfs.infura.io/ipfs/${result.path}`;
    const uri = `${subdomain}/ipfs/${result.path}`;
    // mint nft

    await (await nft.mint(uri)).wait();
    // get tokenId of new nft
    const id = await nft.tokenCount();

    // approve marketplace to spend nft
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString());
    console.log("nft address", nft.address);

    await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
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
                  onChange={uploadToIPFS}
                />
              </Form.Group>
              <Form.Group controlId="propertyImage" className="d-flex">
                <Form.Label style={{ width: "100px" }}>Image:</Form.Label>
                <Form.Control type="file" onChange={uploadToDB} className="" />
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
