import { Link } from "react-router-dom";
// import { div, Nav, Button, Container } from "react-bootstrap";

import ProfileCard from "./ProfileCard";
const Navigation = ({ web3Handler, account, balance, user }) => {
  return (
    // <div expand="lg"  variant="dark" style={{backgroundColor:"#de85e9"}}>
    <div className="navbar-box">


    <nav className="navbar">
      <div className="nav-container">
      <Link to="/" className="navbar-brand">PPPP</Link>
        {/* <div aria-controls="responsive-div-nav" ></div> */}

        {/* <div id="responsive-div-nav"> */}
        <div className="nav-items-box">

          {user.isAdmin ? (
            <ul className="navbar-nav">
              {/* <li as={Link} className="ms-3" to="/admin-dashboard">
                DashBoard
              </li> */}
              <li className="nav-item">
            <Link to="/admin-dashboard" className="nav-link">Dash Board</Link>
          </li>
              
            </ul>
          ) : (
            user === undefined ? '' :     
          //   <Nav className="me-auto">
          //   <Nav.Link as={Link} className="ms-4" to="/">
          //     Home
          //   </Nav.Link>
          //   <Nav.Link as={Link} className="ms-3" to="/create">
          //     Sell Property
          //   </Nav.Link>
          //   <Nav.Link as={Link} className="ms-3" to="/my-listed-items">
          //     My Properties
          //   </Nav.Link>
          // </Nav>
          <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/create" className="nav-link">Sell Property</Link>
          </li>
          <li className="nav-item">
            <Link to="/my-listed-items" className="nav-link">My Properties</Link>
          </li>
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
    {/* </div> */}
    </div>

    
  );
};

export default Navigation;
