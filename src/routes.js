import handlers from "api/handlers";
import community from "api/handlers/communityHandler";

export default (app) => {
  // Define root handler
  app.get("/", handlers.getRoot);

  // Define communities handlers
  app.post("/api/v1/communities", community.createCommunity);
  app.get("/api/v1/communities", community.getCommunities);
  app.get("/api/v1/communities/:uuid", community.getCommunity);
  app.put("/api/v1/communities/:uuid", community.updateCommunity);
  app.del("/api/v1/communities/:uuid", community.deleteCommunity);
};
