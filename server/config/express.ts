import express, { Express } from "express";
import configs from "./config";

import bodyParser from "body-parser";
import methodOverride from "method-override";

const env = process.env.NODE_ENV || 'development';
const config = configs[env];

export default (app: Express) => {
  app.use(express.static(config.rootPath + '/public'));
  app.use(bodyParser.json());
  app.use(methodOverride());
};
