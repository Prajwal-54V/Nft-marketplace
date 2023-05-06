import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function LoginBtn({ setLoginBtn }) {
  const navigate = useNavigate();
  function handleLogin(e) {
    navigate("/login");
    setLoginBtn(false);
  }
  return (
    // <div
    //   style={{
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     minHeight: "80vh",
    //   }}
    // >
    //   <Button variant="primary" type="submit" onClick={handleLogin}>
    //     login
    //   </Button>
    //   <p className="mx-3 my-0">Login in to proceed</p>
    // </div>
    <>
    <div className="home-container">
        {/* <h1 className="home-heading">PPPP</h1> */}
      <div className="card">
        {/* <div className="card-half">
          <h2>Sign Up</h2>
          <p>Become a Registered User.</p>
          <Link to="/register">
          <button>Register</button>
          </Link>
        </div>
        <div className="divider"></div> */}
        <div className="card-half">
          {/* <h2>Log In</h2> */}
          <p>Login in to proceed.</p>
          <Link to="/login">
          <button onClick={handleLogin}>Login</button>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
