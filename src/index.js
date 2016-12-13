
import restify from "restify";
import winston from "winston";

import handlers from "api/handlers";

const app = restify.createServer();
const NODE_ENV = process.env.NODE_ENV;

app.get("/", handlers.getRoot);

if (NODE_ENV !== "test") {
  app.listen(8080, () => winston.info("Listening port 8080"));
}
