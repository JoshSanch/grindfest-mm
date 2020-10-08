import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import connectMongo from "connect-mongo";
import socketio from "socket.io";
import passport from "passport";
import socketioJwt from "socketio-jwt";
import { Server } from "http";

import jwtStrategy from "./config/auth";
import configs from "./config/config";
import expressConfig from "./config/express";
import makeRoutes from "./config/routes";
import makeSocket from "./config/socket";

export interface JwtSocket extends socketio.Socket {
  decoded_token: any;
}

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
import bodyParser from "body-parser";
import { Http2ServerRequest } from "http2";
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

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
passport.use(jwtStrategy);

// Configure routes
makeRoutes(app);

// Start listening
const port = process.env.PORT || 5000;
const server = new Server(app);
const io = socketio(server);

io.sockets
  .on(
    "connection",
    socketioJwt.authorize({
      secret: "SECRET_KEY",
      timeout: 15000, // 15 seconds to send the authentication message
    })
  )
  .on("authenticated", (socket: JwtSocket) => {
    //this socket is authenticated, we are good to handle more events from it.
    makeSocket(socket)
  });

server.listen(port);
console.log("Application started on port " + port);


export default app;
