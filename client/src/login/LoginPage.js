import React from "react";
import axios from "axios";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { userStore, LOGIN_SUCCESS } from "./UserProvider";

import "./LoginPage.scss";

const LoginPage = (setUser) => {
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  const userState = React.useContext(userStore);

  const handleSubmit = async () => {
    try {
      const result = await axios.post("/login", {
        email,
        password,
      });

      userState.dispatch({
        type: LOGIN_SUCCESS,
        payload: result.data,
      });
    } catch (err) {
      // Give the user negative feedback on login
      console.error("Login failed");
    }
  };

  return (
    <div className="login-content">
      <div className="login-pane bg-white text-dark border rounded-sm p-4 mb-3">
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
