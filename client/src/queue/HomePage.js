import React from "react";

import Button from "react-bootstrap/Button";

import io from "socket.io-client";

import { userStore } from "../login/UserProvider";

import Queue from "./Queue.js";

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
  console.log("Assign");
  socket.emit("pool.assign", {});
};

const cancelPoolWave = () => {
  console.log("Cancel");
  socket.emit("wave.cancel");
}

const HomePage = () => {
  const [pool, setPool] = React.useState([]);
  const [pairings, setPairings] = React.useState([]);
  const [waveStarted, setWaveStarted] = React.useState(false);
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
          socket.on("pool.assigned", ({ pairings }) => {
            console.log(pairings);
            setPairings(pairings);
            setWaveStarted(true);
          });
          socket.on("wave.end", () => {
            console.log("Wave ending");
            setWaveStarted(false);
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
        <Queue waveStarted={waveStarted} users={pool} pairings={pairings} />

        {!waveStarted && (
          <Button
            className="queue-button"
            variant="primary"
            onClick={() => joinPool(userState.user)}
          >
            Jump In
          </Button>
        )}
        {userState.user && userState.user.type === 0 && !waveStarted && (
          <Button
            className="queue-button"
            variant="danger"
            onClick={() => startPoolWave()}
          >
            Start Wave
          </Button>
        )}
        {userState.user && userState.user.type === 0 && waveStarted && (
          <Button
            className="queue-button"
            variant="danger"
            onClick={() => cancelPoolWave()}
          >
            Cancel Wave
          </Button>
        )}
        {!waveStarted && (
          <Button
            className="queue-button"
            variant="primary"
            onClick={() => leavePool(userState.user)}
          >
            Hop Out
          </Button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
