import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function LoginBtn({ setLoginBtn }) {
  const navigate = useNavigate();
  function handleLogin(e) {
    navigate("/login");
    setLoginBtn(false);
  }
  return (
    <>
      <div className="home-container">
        <div className="card">
          <div className="card-half">
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
