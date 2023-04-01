import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

function LoginForm({ setLoggedIn, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const alert = useAlert();

  const handleSingIn = async (event) => {
    setLoggedIn(true);
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/login", {
        email,
        password,
      });
      if (response.status === 200) {
        setUser(response.data.user.name);
        alert.show("Logged in successfully!");
        navigate("/");
        setLoggedIn(true);
      } else {
        throw new Error("login  failed");
      }
    } catch (error) {
      console.error(error);
      alert.show("Invalid email or password");
      setLoggedIn(false);
      navigate("/login");
    }
  };

  const handleSingup = async (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  return (
    <div className="content mt-5 d-flex  flex-column">
      <div className="w-50 align-self-center">
        <Form.Group
          controlId="user_email"
          className="d-flex justify-content-center"
        >
          <Form.Label style={{ width: "100px" }}>email :</Form.Label>
          <Form.Control
            className="w-50"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Form.Group>
        <Form.Group
          controlId="user_password"
          className="d-flex justify-content-center my-3"
        >
          <Form.Label style={{ width: "100px" }}>password :</Form.Label>
          <Form.Control
            className="w-50"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" onClick={handleSingIn}>
          SignIn
        </Button>
      </div>

      <button
        type="button"
        className="btn btn-outline-info align-self-center mt-2"
        onClick={handleSingup}
      >
        create account
      </button>
    </div>
  );
}

export default LoginForm;
