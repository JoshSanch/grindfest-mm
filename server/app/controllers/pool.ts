import { Express, Request, Response } from "express";
import { isBuffer } from "util";
import User, { IUser } from "../models/user";

interface PoolJoinReq {
  id: IUser['_id'];
}

const pool: Set<IUser> = new Set();

/**
 * An API endpoint to join the pool
 * @param req the request; must include userId in the JSON body
 * @param res the response
 */
export const joinPool = async (data: PoolJoinReq) => {
  console.log("LOL");
  const { id } = data;
  // const authUser = req.user as IUser;
  // if (userId == null) {
  //   return res.send(400).json({ message: "Missing `userId` parameter" });
  // }

  // const user = await User.findById(userId);
  // if (!user) {
  //   return res
  //     .send(400)
  //     .json({ message: `User with id "${userId}" does not exist` });
  // }

  // if (authUser.isAdmin() || authUser.id === userId) {
  //   pool.add(user);
  //   res.send(200);
  // } else {
  //   res.send(403);
  // }
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
