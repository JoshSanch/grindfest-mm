import React from "react";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <Navbar variant="dark" bg="primary">
        <Navbar.Brand href="#home">Grindfest Matchmaker</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
          </Nav>  
        </Navbar.Collapse>
        <Button variant="success">Signup</Button>
        <Button variant="primary">Login</Button>
      </Navbar>
      <Container>
        
      </Container>
    </div>
  );
}

export default App;
