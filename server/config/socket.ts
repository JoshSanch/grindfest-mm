import { JwtSocket } from "../server";
import { joinPool, leavePool, showPool, generateMatches, PoolJoinReq } from "../app/controllers/pool";

export default (socket: JwtSocket) => {
  console.log("Assigning sockets");
  //=============================
  // Pool routes
  //=============================
  socket.on("pool.join", (req: PoolJoinReq) => joinPool(req, socket));
  socket.on("pool.leave", leavePool);
  socket.on("pool.show", () => showPool(socket));
  socket.on("pool.assign", () => generateMatches(socket))
}