import bcrypt from "bcryptjs";
import User, { IUser } from "../app/models/user";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

passport.serializeUser((user: IUser, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user: IUser) => {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      // Match user
      try {
        console.log("Trying to find user");
        const user = await User.findOne({ email });
        console.log(user);
        if (user) {
          // User exists; we attept to authenticate
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              throw err;
            }

            if (isMatch) {
              return done(null, user);
            } else {
              console.warn("Incorrect password supplied");
              return done(null, false, {
                message: "Invalid username or password.",
              });
            }
          });
        } else {
          // User is new; we register them
          const newUser = new User({ email });
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(password, salt);
          newUser.password = hash;

          try {
            const createdUser = await newUser.save();
            done(null, user);
          } catch (e) {
            done(null, false, { message: e });
          }
        }
      } catch (e) {
        done(null, false, { message: e });
      }
    }
  )
);

export default passport;