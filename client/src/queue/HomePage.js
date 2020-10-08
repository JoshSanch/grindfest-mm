import React from "react";

import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

import io from "socket.io-client";

import { userStore } from "../login/UserProvider";

import "./HomePage.scss";

const url = new URL("/", window.location.href);
url.protocol = url.protocol.replace("http", "ws");
const socket = io.connect("ws://localhost:3000");

const joinPool = ({ id }) => {
  socket.emit("pool.join", { id });
};

const HomePage = () => {
  const [pool, setPool] = React.useState([]);
  const { state: userState } = React.useContext(userStore);

  React.useEffect(() => {
    console.log("Attempt to connect");
    socket.on("connect", () => {
      console.log("Connected.");
      console.log(userState);
      socket
        .emit("authenticate", { token: userState.token })
        .on("authenticated", () => {
          console.log("Authenticated w/ JWT!");
          socket.on("pool.update", ({ pool }) => {
            console.log(pool);
            setPool(pool);
          })
        })
        .on("unauthorized", (msg) => {
          console.log(`Unauthorized: ${JSON.stringify(msg.data)}`);
        });
    });
  }, [userState]);

  return (
    <div className="queue-format">
      <div className="queue-style">
        <h1>Queue</h1>
        <ListGroup className="list">
          {pool.map((user) => (
            <ListGroup.Item>{user.tag}</ListGroup.Item>
          ))}
        </ListGroup>
        <Button
          className="queue-button"
          variant="primary"
          onClick={() => joinPool(userState.user)}
        >
          Jump In
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
