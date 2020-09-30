import { Express, Request, Response } from "express";
import passport from "passport";

import configs from "./config";
import { IUser } from "../app/models/user";

const env = process.env.NODE_ENV || "development";
const config = configs[env];

export default (app: Express) => {
  //=============================
  // Static
  //=============================
  app.get("/", (req: Request, res: Response) => {
    res.sendfile("/index.html", { root: config.rootPath });
  });

  //=============================
  // Auth
  //=============================
  app.post("/authenticate", (req: Request, res: Response, next) => {
    passport.authenticate("local", (err, user: IUser, info) => {
      if (err) {
        return res.status(400).json({ errors: err });
      }
      if (!user) {
        return res
          .status(400)
          .json({ errors: "Invalid username or password." });
      }

      req.logIn(user, (err) => {
        if (err) {
          return res.status(400).json({ errors: err });
        }
        return res.status(200).json({ success: `Logged in ${user.id}` });
      });
    })(req, res, next);
  });
};
