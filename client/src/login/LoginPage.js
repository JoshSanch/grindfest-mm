import React from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "./LoginPage.scss";

const LoginPage = () => (
  <div className="login-content">
    <div className="login-pane bg-white text-dark border rounded-sm p-4 mb-3">
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  </div>
);

export default LoginPage;
