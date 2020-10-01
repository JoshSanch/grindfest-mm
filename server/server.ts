import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import connectMongo from "connect-mongo";
import passport from "./config/auth";

import configs from "./config/config";
import expressConfig from "./config/express";
import makeRoutes from "./config/routes";

const env = process.env.NODE_ENV || "development";
const config = configs[env];
const MongoStore = connectMongo(session);

// Bootstrap database
mongoose.connect(config.db, { useNewUrlParser: true }).catch((e) => {
  console.error("Could not connect to database: " + e.message);
  console.error("Ensure MongoDB is running before starting the server.");
  process.exit(1);
});

// Configure server
const app = express();
expressConfig(app);
makeRoutes(app);

// Configure sessions
app.use(
  session({
    secret: "test secret value",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Configure auth
app.use(passport.initialize());
app.use(passport.session());

// Start listening
const port = process.env.PORT || 3000;
app.listen(port);
console.log("Application started on port " + port);

export default app;
