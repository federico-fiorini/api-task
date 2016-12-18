import mongoose from "mongoose";
import winston from "winston";
import config from "../config.json";

// Connect to mongodb
mongoose.connect(config.dbPath);
const db = mongoose.connection;

// Define event listeners
db.on("error", () => {
  winston.log("error", "Error occured from db");
});

db.once("open", () => {
  winston.log("info", "successfully opened the db");
});

export default mongoose;
