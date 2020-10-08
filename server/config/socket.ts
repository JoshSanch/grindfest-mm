import SocketIO from "socket.io";

import { joinPool, leavePool, showPool } from "../app/controllers/pool";

export default (socket: SocketIO.Socket) => {
  console.log("Assigning sockets");
  //=============================
  // Pool routes
  //=============================
  socket.on("pool.join", joinPool);
  socket.on("pool.leave", leavePool);
  socket.on("pool.show", showPool);
}