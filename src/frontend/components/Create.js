
import { useState } from "react";
import { Row, Form, Button } from "react-bootstrap";
import LoginBtn from "./LoginBtn";
import axios from "axios";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import { client, subdomain } from "../../constants/IPFS";
import  "../components/styles.css";

const Create = ({ marketplace, nft, loggedIn, setLoginBtn, account, user }) => {
  const [image, setImage] = useState("");
  const [document, setDocument] = useState("");
  const [khataCertificate, setkhata] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [taxRecipt,setTaxRecipt]= useState("");
  
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
          
        }
        else if(type==="tax"){
          setTaxRecipt(`${subdomain}/ipfs/${result.path}`);
        } 
        else if(type==="khata"){
          setkhata(`${subdomain}/ipfs/${result.path}`);
        } else if (type === "img") setImage(`${subdomain}/ipfs/${result.path}`);
      } catch (error) {
        console.log("ipfs Document upload error: ", error);
      }
    }
  };

  const requestForPropertyApproval = async () => {
    if (!image || !price || !location || !description || !document|| !khataCertificate || !taxRecipt) return;

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
    <div className=" mt-5">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 mx-auto"
          style={{ maxWidth: "1000px" }}
        >
          <div className="content mx-auto " >
            <Row className="g-4">
            <div className="documents">
              <Form.Group controlId="propertyDocument" className="d-flex">
                <Form.Label style={{ width: "150px" }}>Property Document:</Form.Label>
                <Form.Control
                  type="file"
                  className="docs"
                  onChange={(e) => uploadToIPFS(e, "doc")}
                />
              </Form.Group>
              <Form.Group controlId="taxRecipt" className="d-flex">
                <Form.Label style={{ width: "150px" }}>Tax Recipt:</Form.Label>
                <Form.Control
                  type="file"
                  className="docs"
                  onChange={(e) => uploadToIPFS(e, "tax")}
                />
              </Form.Group>
              <Form.Group controlId="khataCertificate" className="d-flex">
                <Form.Label style={{ width: "150px" }}>Khata Certificate :</Form.Label>
                <Form.Control
                  type="file"
                  className="docs"
                  onChange={(e) => uploadToIPFS(e, "khata")}
                />
              </Form.Group>
              
             
              <Form.Group controlId="propertyImage" className="d-flex">
                <Form.Label style={{ width: "150px" }}>Image:</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => uploadToIPFS(e, "img")}
                  className="docs"
                />
              </Form.Group>
              <Form.Control
                onChange={(e) => setLocation(e.target.value)}
                size="lg"
                required
                type="text"
                placeholder="location"
                className="docs"
              />
              <Form.Control
                onChange={(e) => setDescription(e.target.value)}
                size="lg"
                required
                as="textarea"
                placeholder="Description"
                className="docs"
              />
              <Form.Control
                onChange={(e) => setPrice(e.target.value)}
                size="lg"
                required
                type="number"
                placeholder="Price in ETH"
                className="docs"
              />
          </div>
              <Button
                onClick={requestForPropertyApproval}
                variant="primary"
                type="submit"
              >
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
