import { JwtSocket } from "../server";
import {
  joinPool,
  leavePool,
  showPool,
  generateMatches,
  cancelWave,
  PoolJoinReq,
  PoolLeaveReq,
} from "../app/controllers/pool";

export default (socket: JwtSocket) => {
  console.log("Assigning sockets");
  //=============================
  // Pool routes
  //=============================
  socket.on("pool.join", (req: PoolJoinReq) => joinPool(req, socket));
  socket.on("pool.leave", (req: PoolLeaveReq) => leavePool(req, socket));
  socket.on("pool.show", () => showPool(socket));
  socket.on("pool.assign", () => generateMatches(socket));
  socket.on("wave.cancel", () => cancelWave(socket));
};
