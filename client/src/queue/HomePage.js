import React from "react";

import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

import io from "socket.io-client";

import { userStore } from "../login/UserProvider";

import "./HomePage.scss";

const url = new URL("/", window.location.href);
url.protocol = url.protocol.replace("http", "ws");
var socket;

const joinPool = ({ _id: id }) => {
  socket.emit("pool.join", { id });
};

const leavePool = ({ _id: id }) => {
  socket.emit("pool.leave", { id });
};

const startPoolWave = () => {
  socket.emit("pool.assign", {});
};

const HomePage = () => {
  const [pool, setPool] = React.useState([]);
  const { state: userState } = React.useContext(userStore);

  React.useEffect(() => {
    console.log("Attempt to connect");
    socket = io.connect(url.toString());
    socket.on("connect", () => {
      console.log("Connected.");
      socket
        .emit("authenticate", { token: userState.token })
        .on("authenticated", () => {
          console.log("Authenticated w/ JWT!");
          socket.emit("pool.show", {});
          socket.on("pool.update", ({ pool }) => {
            setPool(pool);
          });
        })
        .on("unauthorized", (msg) => {
          console.log(`Unauthorized: ${JSON.stringify(msg.data)}`);
        });
    });
  }, []);

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
        {
          <Button
            className="queue-button"
            variant="danger"
            onClick={() => startPoolWave()}
          >
            Start Wave
          </Button>
        }
        <Button
          className="queue-button"
          variant="primary"
          onClick={() => leavePool(userState.user)}
        >
          Hop Out
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
