import restify from "restify";
import winston from "winston";
import config from "config";
import routes from "./routes";

// Create resify server
const app = restify.createServer();

app.use(restify.fullResponse());
app.use(restify.bodyParser());
app.use(restify.queryParser());

// Get environment variables
const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || config.port;

if (NODE_ENV !== "test") {
  app.listen(PORT, () => winston.info(`Listening port ${PORT}`));
}

// Init routes
routes(app);
