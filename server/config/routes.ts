import { Express, Request, Response } from "express";
import configs from "./config";

const env = process.env.NODE_ENV || 'development';
const config = configs[env];

export default (app: Express) => {
  //=============================
  // Static
  //=============================
  app.get('/', (req: Request, res: Response) => {
    res.sendfile('/index.html', { root: config.rootPath });
  });

};
