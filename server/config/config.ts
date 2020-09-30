import path from "path";

interface Config {
  readonly [envName: string]: any
}

const configs: Config = {
  development: {
    rootPath: path.normalize(__dirname + "/.."),
    db: "mongodb://localhost/test",
  },
  production: {},
};

export default configs;