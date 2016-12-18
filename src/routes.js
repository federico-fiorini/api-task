import handlers from "api/handlers";
import community from "./handlers/communityHandler";

export default (app) => {
  // Define root handler
  app.post("/", handlers.getRoot);

  // Define communities handlers
  app.post("/communities", community.createCommunity);
  app.get("/communities", community.getCommunities);
  app.get("/communities/:uuid", community.getCommunity);
  app.put("/communities/:uuid", community.updateCommunity);
  app.del("/communities/:uuid", community.deleteCommunity);
};
