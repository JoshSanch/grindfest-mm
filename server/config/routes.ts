import { Express, Request, Response } from "express";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import configs from "./config";
import User, { IUser } from "../app/models/user";
import { logIn } from "./auth";

const env = process.env.NODE_ENV || "development";
const config = configs[env];

export default (app: Express) => {
  //=============================
  // Static
  //=============================
  app.get("/", (req: Request, res: Response) => {
    res.sendfile(path.resolve(__dirname, '../client/build', 'index.html'));
  });

  //=============================
  // Auth
  //=============================
  app.post("/api/signup", async (req, res) => {
    const { email, password, tag } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          message: "User already exists",
        });
      }

      // Create the user
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);
      const newUser = new User({ email, password: hash, tag });
      await newUser.save();
      await logIn(email, password, res);
    } catch {
      return res.status(500).json({
        message: "Could not create user",
      });
    }
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    logIn(email, password, res);
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', (req, res) => {
    res.sendfile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
};
