import React from "react";
import { Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function LoginBtn({ setLoginBtn }) {
  const navigate = useNavigate();
  function handleLogin(e) {
    navigate("/login");
    setLoginBtn(false);
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <Button variant="primary" type="submit" onClick={handleLogin}>
        login
      </Button>
      <p className="mx-3 my-0">Login in to proceed</p>
    </div>
  );
}
