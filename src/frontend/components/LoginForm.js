import React, { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { Link } from "react-router-dom";

function LoginForm({ setLoggedIn, setUser, account }) {
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
        account,
      });
      if (response.status === 200) {
        setUser(response.data.user);

        alert.show("Logged in successfully!");
        navigate("/");
        setLoggedIn(true);
      } else {
        throw new Error("login  failed");
      }
    } catch (error) {
      console.error(error);
      alert.show("Invalid email or password or metamsk account");
      setLoggedIn(false);
      navigate("/login");
    }
  };
  


  const handleSingup = async (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  return (
    // <div className="content mt-5 d-flex  flex-column">
    //   <div className="w-50 align-self-center">
    //     <Form.Group
    //       controlId="user_email"
    //       className="d-flex justify-content-center"
    //     >
    //       <Form.Label style={{ width: "100px" }}>email :</Form.Label>
    //       <Form.Control
    //         className="w-50"
    //         type="email"
    //         placeholder="Enter email"
    //         value={email}
    //         onChange={(event) => setEmail(event.target.value)}
    //       />
    //     </Form.Group>
    //     <Form.Group
    //       controlId="user_password"
    //       className="d-flex justify-content-center my-3"
    //     >
    //       <Form.Label style={{ width: "100px" }}>password :</Form.Label>
    //       <Form.Control
    //         className="w-50"
    //         type="password"
    //         placeholder="Password"
    //         value={password}
    //         onChange={(event) => setPassword(event.target.value)}
    //       />
    //     </Form.Group>

    //     <Button variant="primary" type="submit" onClick={handleSingIn}>
    //       SignIn
    //     </Button>
    //   </div>

    //   <button
    //     type="button"
    //     className="btn btn-outline-info align-self-center mt-2"
    //     onClick={handleSingup}
    //   >
    //     create account
    //   </button>
    // </div>
    <>
    <div className="auth-container">

      <div className="form-container">
        <form onSubmit={(event) => handleSingIn(event)}>
          <div className="brand">
            {/* <img src="" alt="" /> */}
            <h1>Sign In</h1>
          </div>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            min="3"
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}

          />

          <button type="submit">Login</button>
          <span style={{

            display: "flex",
          }
          }>
            Dont Have an Account? <Link to="/register"><div onClick={handleSingup}>&nbsp; Register</div ></Link>
          </span>
        </form>
      
      </div>
    </div>
      {/* <ToastContainer theme="colored" closeOnClick={true} /> */}
    </>

  );
}

export default LoginForm;
