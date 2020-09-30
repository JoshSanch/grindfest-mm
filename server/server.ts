import express from "express";
import mongoose from "mongoose";

import configs from "./config/config";
import expressConfig from "./config/express";
import makeRoutes from "./config/routes"; 

const env = process.env.NODE_ENV || "development";
const config = configs[env];

// Bootstrap database
mongoose.connect(config.db).catch((e) => {
  console.error("Could not connect to database: " + e.message);
  console.error("Ensure MongoDB is running before starting the server.");
  process.exit(1);
});

// Configure server
const app = express();
expressConfig(app);
makeRoutes(app);

// Start listening
const port = process.env.PORT || 3000;
app.listen(port);
console.log("Application started on port " + port);

export default app;
