import path from "path";

interface Config {
  readonly [envName: string]: any
}

const configs: Config = {
  development: {
    rootPath: path.normalize(__dirname + "/.."),
    db: "mongodb://localhost/grindfestmm",
  },
  production: {
    db: process.env.MONGO_URI,
  },
};

export default configs;