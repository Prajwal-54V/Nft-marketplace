import { Link } from "react-router-dom";

import ProfileCard from "./ProfileCard";
const Navigation = ({ web3Handler, account, balance, user }) => {
  return (
    <div className="navbar-box">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="navbar-brand">
            BLOCK ESTATE
          </Link>

          <div className="nav-items-box">
            {user.isAdmin ? (
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to="/admin-dashboard" className="nav-link">
                    Dash Board
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="navbar-nav">
                {Object.keys(user).length > 0 ? (
                  <>
                    <li className="nav-item">
                      <Link to="/" className="nav-link">
                        Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/create" className="nav-link">
                        Sell Property
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/my-listed-items" className="nav-link">
                        My Properties
                      </Link>
                    </li>
                  </>
                ) : (
                  ""
                )}
              </ul>
            )}
            <div className="nav-item-end">
              {account ? (
                Object.keys(user).length > 0 && <ProfileCard />
              ) : (
                <button onClick={web3Handler} className="buttons">
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
