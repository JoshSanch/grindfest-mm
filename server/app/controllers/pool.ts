import { JwtSocket } from "../../server";
import { Express, Request, Response } from "express";
import User, { IUser } from "../models/user";
import { Set } from "immutable";

export interface PoolJoinReq {
  id: IUser["_id"];
}

export interface PoolLeaveReq {
  id: IUser["_id"];
}

let pool: Set<IUser> = Set();

/**
 * An API endpoint to join the pool
 * @param req the request; must include userId in the JSON body
 * @param res the response
 */
export const joinPool = async (data: PoolJoinReq, socket: JwtSocket) => {
  const { id } = data;
  const authUserId = socket.decoded_token._id;

  console.log(socket.decoded_token);

  const user = await User.findById(id);
  const authUser = await User.findById(authUserId);
  if (!user) {
    console.error("User doesn't exist");
  } else if (authUser.isAdmin() || authUser.id === id) {
    pool = pool.add(user);
  }

  socket.broadcast.emit("pool.update", { pool: [...pool.values()] });
  socket.emit("pool.update", { pool: [...pool.values()] });
};

/**
 * An API endpoint to leave the pool
 * @param req the request; must include userId in the JSON body
 * @param res the response
 */
export const leavePool = async (data: PoolLeaveReq, socket: JwtSocket) => {
  const { id } = data;
  const authUserId = socket.decoded_token._id;

  console.log(socket.decoded_token._id);

  const user = await User.findById(id);
  const authUser = await User.findById(authUserId);
  if (!user) {
    console.error("User doesn't exist");
  } else if (authUser.isAdmin() || authUser.id === id) {
    pool = pool.delete(user);
  }

  socket.broadcast.emit("pool.update", { pool: [...pool.values()] });
  socket.emit("pool.update", { pool: [...pool.values()] });
};

export const showPool = (socket: JwtSocket) => {
  socket.emit("pool.update", { pool: [...pool.values()] });
};
