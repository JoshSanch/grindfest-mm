import User, { IUser } from "../app/models/user";
import passport from "passport";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Response } from "express";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "SECRET_KEY",
};

passport.serializeUser((user: IUser, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user: IUser) => {
    done(err, user);
  });
});

export const logIn = async (email: string, password: string, res: Response) => {
  const user = await User.findOne({ email });

  if (user) {
    // User exists; we attept to authenticate
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        throw err;
      }

      if (isMatch) {
        // Generate JWT
        const opts: jwt.SignOptions = {
          expiresIn: 360000,
        };
        const secret = "SECRET_KEY";
        const token = jwt.sign({ email, id: user.id }, secret, opts);
        return res.status(200).json({
          message: "Auth was successful",
          user,
          token,
        });
      } else {
        console.warn("Incorrect password supplied");
        return res.status(401).json({
          message: "Auth failed.",
        });
      }
    });
  } else {
    return res.status(401).json({
      message: "Auth failed.",
    });
  }
};

export default new JwtStrategy(opts, async (jwtPayload: IUser, done) => {
  // Match user
  try {
    const { email } = jwtPayload;
    await User.findOne({ email });
    return done(null, true);
  } catch {
    return done(null, false);
  }
});
