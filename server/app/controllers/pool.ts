import { JwtSocket } from "../../server";
import { Express, Request, Response } from "express";
import User, { IUser } from "../models/user";
import { Set } from "immutable";

export interface PoolJoinReq {
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
  const authUserId = socket.decoded_token.id;

  console.log(data);

  const user = await User.findById(id);
  const authUser = await User.findById(authUserId);
  if (!user) {
    return console.error("User doesn't exist");
  }

  if (authUser.isAdmin() || authUser.id === id) {
    pool = pool.add(user);
    socket.emit("pool.update", { pool: [...pool.values()] });
  }
};

/**
 * An API endpoint to leave the pool
 * @param req the request; must include userId in the JSON body
 * @param res the response
 */
export const leavePool = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const authUser = req.user as IUser;
  if (userId == null) {
    return res.status(400).json({ message: "Missing `userId` parameter" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res
      .status(400)
      .json({ message: `User with id "${userId}" does not exist` });
  }

  if (authUser.isAdmin() || authUser.id === userId) {
    pool.delete(user);
    res.send(200);
  } else {
    res.send(403);
  }
};

export const showPool = (req: Request, res: Response) => {
  console.log([...pool]);
  res.status(200).json({ pool: [...pool] });
};
