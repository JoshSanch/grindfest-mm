import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import LoginPage from "./login/LoginPage";
import HomePage from "./queue/HomePage";
import { userStore } from "./login/UserProvider";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

function App() {
  const { state: userState } = React.useContext(userStore);
  console.log(userState);
  const isLoggedIn = Object.keys(userState).length > 0;

  return (
    <Router>
      <div className="App">
        <Navbar variant="dark" bg="primary">
          <Navbar.Brand href="#home">Grindfest Matchmaker</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#home">Home</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          {!isLoggedIn && (
            <>
              <Link to="/signup">
                <Button variant="success">Signup</Button>
              </Link>
              <Link to="/login">
                <Button variant="primary">Login</Button>
              </Link>
            </>
          )}
          {isLoggedIn && (
            <Link to="/">
              <Button variant="danger">Logout</Button>
            </Link>
          )}
        </Navbar>
        <Container className="content">
          <Switch>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        </Container>
      </div>
    </Router>
  );
}

export default App;
