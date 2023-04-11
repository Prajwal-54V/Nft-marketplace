import { Link } from "react-router-dom";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import market from "./market.png";

const Navigation = ({ web3Handler, account, balance, user }) => {
  return (
    <Navbar expand="lg" bg="secondary" variant="dark">
      <Container>
        <Navbar.Brand href="/">
          <img src={market} width="40" height="40" alt="" />
          &nbsp;&nbsp; Property Marketplace
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} className="ms-4" to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} className="ms-3" to="/create">
              Sell Property
            </Nav.Link>
            <Nav.Link as={Link} className="ms-3" to="/my-listed-items">
              Listed Properties
            </Nav.Link>
            <Nav.Link as={Link} className="ms-3" to="/my-purchases">
              Purchases
            </Nav.Link>
            {user.isAdmin ? (
              <Nav.Link as={Link} className="ms-3" to="/admin-dashboard">
                DashBoard
              </Nav.Link>
            ) : (
              ""
            )}
          </Nav>
          <Nav>
            {account ? (
              <>
                <Nav.Link
                  // href={`https://etherscan.io/address/${account}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button nav-button btn-sm"
                >
                  <Button variant="outline-light">
                    {account.slice(0, 5) + "..." + account.slice(38, 42)}
                    <br />
                    balance : {parseFloat(balance).toFixed(4)}
                  </Button>
                </Nav.Link>
              </>
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
