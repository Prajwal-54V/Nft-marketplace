import React, { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { Link } from "react-router-dom";

function SignupForm({ setLoggedIn, account, setUser }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const alert = useAlert();

  const handleSingUp = async (event) => {
    event.preventDefault();
    try {
      console.log(username,
        email,
        password,
        account,)
      const response = await axios.post("http://localhost:4000/signup", {
        username,
        email,
        password,
        account,
      });

      if (response.status === 200) {
        setUser(response.data.user);
        localStorage.setItem("token", response.data.token);
        navigate("/");
        setLoggedIn(true);
        alert.show("Account created successfully !");
      } else {
        throw new Error("sign up failed");
      }
    } catch (error) {
      console.error(error);
      alert.show("Sign up failed , try again !");
      navigate("/signup");
      setLoggedIn(false);
    }
  };

  const handleSingIn = async (event) => {
    event.preventDefault();
    navigate("/login");
  };

  return (
    // <div className="content mt-5 d-flex  flex-column">
    //   <div className="w-50 align-self-center">
    //     <Form.Group
    //       controlId="user_name"
    //       className="d-flex justify-content-center"
    //     >
    //       <Form.Label style={{ width: "100px" }}>user name :</Form.Label>
    //       <Form.Control
    //         className="w-50"
    //         type="text"
    //         placeholder="Enter username"
    //         value={username}
    //         onChange={(event) => setUsername(event.target.value)}
    //       />
    //     </Form.Group>
    //     <Form.Group
    //       controlId="user_email"
    //       className="d-flex justify-content-center mt-3"
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

    //     <Button variant="primary" type="submit" onClick={handleSingup}>
    //       Create Account
    //     </Button>
    //   </div>

    //   <button
    //     type="button"
    //     className="btn btn-outline-info align-self-center mt-2"
    //     onClick={handleSingIn}
    //   >
    //     Sing In
    //   </button>
    // </div>
    <>
    <div className="auth-container">

<div className="form-container">
  <form onSubmit={(event) => handleSingUp(event)}>
    <div className="brand">
      {/* <img src="" alt="" /> */}
      <h1>Sign Up</h1>
    </div>
    <input
      type="text"
      placeholder="Username"
      name="username"
      value={username}
      min="3"
      onChange={(event) => setUsername(event.target.value)}
    />
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

    <button type="submit">Sign Up</button>
    <span style={{

      display: "flex",
    }
    }>
      Already have an Account? <Link to="/register"><div onClick={handleSingIn}>&nbsp; Login</div ></Link>
    </span>
  </form>

</div>
</div>
    </>
  );
}

export default SignupForm;
