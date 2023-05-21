import React, { useState } from "react";
import axios from "axios";
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
        if (response.data.user.isAdmin) {
          navigate("/admin-dashboard");
        } else navigate("/");
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
    <>
      <div className="auth-container">
        <div className="form-container">
          <form onSubmit={(event) => handleSingIn(event)}>
            <div className="brand">
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
            <span
              style={{
                display: "flex",
              }}
            >
              Dont Have an Account?{" "}
              <Link to="/register">
                <div onClick={handleSingup}>&nbsp; Register</div>
              </Link>
            </span>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
