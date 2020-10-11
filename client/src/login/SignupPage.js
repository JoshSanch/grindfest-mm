import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { userStore, LOGIN_SUCCESS } from "./UserProvider";

import "./LoginPage.scss";

const SignupPage = () => {
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  const [verifyPassword, setVerifyPassword] = React.useState();
  const [tag, setTag] = React.useState();

  const [isValidated, setIsValidated] = React.useState(false);
  const userState = React.useContext(userStore);

  const handleSubmit = async (e) => {
    if (!e.target.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    setIsValidated(true);

    try {
      const result = await axios.post("/api/signup", {
        email,
        password,
        tag,
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

  return userState.state.token ? (
    <Redirect to="/" />
  ) : (
    <div className="login-content">
      <div className="login-pane bg-white text-dark border rounded-sm p-4 mb-3">
        <Form noValidate validated={isValidated}>
          <Form.Group>
            <Form.Label>Smash Tag</Form.Label>
            <Form.Control
              type="text"
              placeholder="Your community display name"
              onChange={(e) => setTag(e.target.value)}
              isValid={tag && tag.length > 0}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <br></br>
            <Form.Control
              type="password"
              placeholder="Verify your password"
              onChange={(e) => setVerifyPassword(e.target.value)}
              required
              isInvalid={password && password !== verifyPassword}
            />
            <Form.Control.Feedback type="invalid">
              Passwords do not match
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default SignupPage;
