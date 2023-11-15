import mongoose, { ConnectOptions } from "mongoose";
import config from "../config/default";
import log from "../log";

function connect() {
  const dbUri = config.get("dbUrl") as string;

  return mongoose
    .connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions)
    .then(() => {
      log.info("Database connceted successfully");
    })
    .catch((err) => {
      log.error("db error", err);
      process.exit(1);
    });
}

export default connect;
