import { Link } from "react-router-dom";
import { Navbar, Nav, Button, Container } from "react-bootstrap";

import ProfileCard from "./ProfileCard";
const Navigation = ({ web3Handler, account, balance, user }) => {
  return (
    <Navbar expand="lg"  variant="dark" style={{backgroundColor:"#de85e9"}}>
      <Container>
        <Navbar.Brand href="/">
          {/* <img src={market} width="40" height="40" alt="" /> */}
          &nbsp;&nbsp; Property Marketplace
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
          {user.isAdmin ? (
            <Nav className="me-auto">
              <Nav.Link as={Link} className="ms-3" to="/admin-dashboard">
                DashBoard
              </Nav.Link>
            </Nav>
          ) : (
            user === undefined ? '' :     <Nav className="me-auto">
            <Nav.Link as={Link} className="ms-4" to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} className="ms-3" to="/create">
              Sell Property
            </Nav.Link>
            <Nav.Link as={Link} className="ms-3" to="/my-listed-items">
              My Properties
            </Nav.Link>
          </Nav>
        
          )}

          <Nav>
            {account ? (
              Object.keys(user).length > 0 && <ProfileCard />
            ) : (
              <Button onClick={web3Handler} variant="outline-light">
                Connect Wallet
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
