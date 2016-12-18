import restify from "restify";
import winston from "winston";
import config from "../config";
import handlers from "api/handlers";

// Create resify server
const app = restify.createServer();

// Get environment variables
const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || config.port;

app.get("/", handlers.getRoot);

if (NODE_ENV !== "test") {
  app.listen(PORT, () => winston.info("Listening port " + PORT));
}