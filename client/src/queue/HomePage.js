import React from "react";
import axios from "axios";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

import "./HomePage.scss";

const HomePage = () => {
  const [email, setEmail] = React.useState();

  const AddSelfToQueue = async () => {
    //Here we'll get the username from the state and add it at the end of the queue
  };

  return (
    <div className="queue-format">
      <div className="queue-style">
        <ListGroup className="list">
          <ListGroup.Item>Adeel</ListGroup.Item>
          <ListGroup.Item>Chuck</ListGroup.Item>
          <ListGroup.Item>Racer X</ListGroup.Item>
          <ListGroup.Item>Pickle Rick</ListGroup.Item>
          <ListGroup.Item>Kazuma Kiryu</ListGroup.Item>
          <ListGroup.Item>Teneez Given Physical Form</ListGroup.Item>
        </ListGroup>
        <Button variant="primary" onClick={AddSelfToQueue}>
          Jump In
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
