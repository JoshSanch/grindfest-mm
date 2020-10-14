import { JwtSocket } from "../../server";
import { Express, Request, Response } from "express";
import User, { IUser } from "../models/user";
import Match, { IMatch } from "../models/match";
import { Set } from "immutable";
import { Random, nodeCrypto } from "random-js";

const MAX_MATCHMAKING_TRIES = 100;

export interface PoolJoinReq {
  id: IUser["_id"];
}

let pool: Set<IUser> = Set();
let matchedPairs: Set<Set<IUser>> = Set();
let byePlayers: Set<IUser> = Set();

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

export const showPool = (socket: JwtSocket) => {
  socket.emit("pool.update", { pool: [...pool.values()] });
};

export const generateMatches = (socket: JwtSocket) => {
  let pairs: ([IUser, IUser] | [IUser])[] = [];

  for (let attempt = 0; attempt < MAX_MATCHMAKING_TRIES; attempt++) {
    // Shuffle the pool
    const tempPool = [...pool.values()];
    const shuffledPool = new Random(nodeCrypto).shuffle(tempPool);
    pairs = shuffledPool.reduce((res, val, i, array) => {
      if (i % 2 === 0) {
        res.push(array.slice(i, i + 2));
      }

      return res;
    }, []).filter(pair => !matchedPairs.includes(pair));

    // Reject if not all pairings were made
    if (pairs.length < Math.floor(pool.size / 2)) {
      continue;
    }

    // Check for a bye
    if (pairs.length > 0 && pairs[pairs.length - 1].length === 1) {
      const byePlayer = pairs[pairs.length - 1][0];
      // If this player has already had a bye and we still have retries left,
      // try again
      if (matchedPairs.includes(Set([byePlayer]))) {
        continue;
      }
    }
  }

  console.log(pairs);

  // Cache the pairs
  pairs.forEach(pair => matchedPairs = matchedPairs.add(Set(pair)));

  // Add the matches to the database
  const match = new Match();
  match.players = pairs.pop().map(user => user.id);
};
