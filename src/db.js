import mongoose from "mongoose";
import winston from "winston";
import config from "config";

// See http://mongoosejs.com/docs/promises.html
mongoose.Promise = global.Promise;

if (process.env.NODE_ENV !== "test") {
  // Connect to mongodb
  mongoose.connect(config.dbPath);
  const db = mongoose.connection;

  // Define event listeners
  db.on("error", () => {
    winston.error("Error occured from db");
  });

  db.once("open", () => {
    winston.info("Connected to mongodb");
  });
}

export default mongoose;
