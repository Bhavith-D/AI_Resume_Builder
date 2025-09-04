import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  Offcanvas,
  Button,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import ResumeBuilder from "./ResumeBuilder";
import About from "./About";
import Contact from "./Contact";
import Account from "./Account";

function App() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Router>
      <div className="bg-light min-vh-100 d-flex flex-column">
        <CustomNavbar handleShow={handleShow} />
        <Offcanvas show={show} onHide={handleClose} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Navigation</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/" onClick={handleClose}>
                Resume Builder
              </Nav.Link>
              <Nav.Link as={Link} to="/about" onClick={handleClose}>
                About
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" onClick={handleClose}>
                Contact
              </Nav.Link>
              <Nav.Link as={Link} to="/account" onClick={handleClose}>
                Account
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>

        <Container fluid className="flex-grow-1 d-flex flex-column">
          <Routes>
            <Route path="/" element={<ResumeBuilder />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

function CustomNavbar({ handleShow }) {
  const navigate = useNavigate();

  const handleAccountClick = () => {
    navigate("/account");
  };

  return (
    <Navbar
      expand="lg"
      className="mb-4 pt-4 px-4"
      style={{
        backgroundColor: "#6A453A",
        height: "6rem",
      }}
    >
      <Container fluid className="d-flex align-items-center">
        <Navbar.Brand
          as={Link}
          to="/"
          className="text-white fw-bold me-auto"
          style={{ fontSize: "1.5rem" }}
        >
          AI Resume Builder 🤖
        </Navbar.Brand>
        <div className="d-none d-md-flex align-items-center">
          <Nav className="me-3">
            <Nav.Link as={Link} to="/about" className="text-white">
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="text-white">
              Contact
            </Nav.Link>
          </Nav>
          <Button variant="dark" onClick={handleAccountClick} className="fw-bold">
            Account
          </Button>
        </div>
        <Button
          variant="outline-light"
          onClick={handleShow}
          className="d-md-none"
        >
          <span className="navbar-toggler-icon"></span>
        </Button>
      </Container>
    </Navbar>
  );
}

export default App;