import { useState } from "react";
import { Row, Form, Button } from "react-bootstrap";
import LoginBtn from "./LoginBtn";
import axios from "axios";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import { client, subdomain } from "../../constants/IPFS";
import "../components/styles.css";

const Create = ({ marketplace, nft, loggedIn, setLoginBtn, account, user }) => {
  const [imageName, setImageName] = useState(null);
  const [image, setImage] = useState("");
  const [document, setDocument] = useState("");
  const [documentName, setDocumentName] = useState(null);
  const [khataCertificateName, setkhataName] = useState(null);
  const [khataCertificate, setkhata] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [taxReciptName, setTaxReciptName] = useState(null);
  const [taxRecipt, setTaxRecipt] = useState("");

  const alert = useAlert();
  const navigate = useNavigate();

  //
  const uploadToIPFS = async (event, type) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (typeof file !== "undefined") {
      try {
        const result = await client.add(file);
        console.log(result);

        if (type === "doc") {
          setDocumentName(event.target.files[0].name);
          setDocument(`${subdomain}/ipfs/${result.path}`);
        } else if (type === "tax") {
          setTaxReciptName(event.target.files[0].name);
          setTaxRecipt(`${subdomain}/ipfs/${result.path}`);
        } else if (type === "khata") {
          setkhataName(event.target.files[0].name);
          setkhata(`${subdomain}/ipfs/${result.path}`);
        } else if (type === "img") {
          setImageName(event.target.files[0].name);
          setImage(`${subdomain}/ipfs/${result.path}`);
        }
      } catch (error) {
        console.log("ipfs Document upload error: ", error);
      }
    }
  };

  const requestForPropertyApproval = async (event) => {
    event.preventDefault();
    if (
      !image ||
      !price ||
      !location ||
      !description ||
      !document ||
      !khataCertificate ||
      !taxRecipt
    ) {
      alert.info("please upload all documents before submite!.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/reqForApproveProperty",
        {
          image,
          document,
          khataCertificate,
          taxRecipt,
          price,
          location,
          description,
          user,
        }
      );
      if (response.status === 200) {
        alert.show(
          "property requested for approval, will be listed when approved"
        );
        navigate("/my-listed-items");
      } else {
        throw new Error("cannot request property approve,  failed");
      }
    } catch (error) {
      console.error(error);
      alert.show("cannot request property approve");
      navigate("/create");
    }
  };

  if (!loggedIn) return <LoginBtn setLoginBtn={setLoginBtn} />;
  return (
    <>
      <div className="auth-container">
        <div className="form-container">
          <form
            onSubmit={(event) => {
              requestForPropertyApproval(event);
            }}
          >
            <div className="brand">
              <h1>Upload</h1>
            </div>
            <label className="file-label" htmlFor="doc">
              Choose Property Document
              <input
                className="custom-file-input"
                id="doc"
                type="file"
                onChange={(e) => uploadToIPFS(e, "doc")}
              />
              {documentName && <p>Selected file: {documentName}</p>}
            </label>

            <label className="file-label" htmlFor="tax">
              Choose Tax Document
              <input
                className="custom-file-input"
                id="tax"
                type="file"
                onChange={(e) => uploadToIPFS(e, "tax")}
              />
              {taxReciptName && <p>Selected file: {taxReciptName}</p>}
            </label>

            <label className="file-label" htmlFor="khata">
              Choose Khata Document
              <input
                className="custom-file-input"
                id="khata"
                type="file"
                onChange={(e) => uploadToIPFS(e, "khata")}
              />
              {khataCertificateName && (
                <p>Selected file: {khataCertificateName}</p>
              )}
            </label>

            <label className="file-label" htmlFor="img">
              Choose Image File
              <input
                className="custom-file-input"
                id="img"
                type="file"
                onChange={(e) => uploadToIPFS(e, "img")}
              />
              {imageName && <p>Selected file: {imageName}</p>}
            </label>

            <input
              type="text"
              placeholder="Location"
              name="location"
              value={location}
              min="3"
              required
              onChange={(e) => setLocation(e.target.value)}
            />
            <input
              type="textarea"
              placeholder="Description"
              name="description"
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="number"
              placeholder="Price In ETH"
              name="price"
              value={price}
              required
              onChange={(e) => setPrice(e.target.value)}
            />

            <button type="submit">Upload</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Create;
