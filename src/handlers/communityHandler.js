import uuidV1 from "uuid/v1";
import slug from "slug";
import lodash from "lodash";
import Community from "api/models/communityModel";
import handlers from "api/handlers";

function CommunityHandler() {

  // Filter results to remove database specific fields
  const schemaKeys = Object.keys(Community.schema.obj);

  // Create new community
  this.createCommunity = (req, res) => {
    // Set community object
    let newCommunity = {
      uuid: uuidV1(),
      name: req.params.name,
      description: req.params.description,
      slug: req.params.name !== undefined ? slug(req.params.name) : undefined,
    };

    // Filter to remove undefined fields
    newCommunity = lodash.pickBy(newCommunity);

    Community.create(newCommunity, (err, result) => {
      // Return error status
      if (err) {
        return handlers.sendResponseData(res, 400);
      }

      // Return result
      return handlers.sendResponseData(res, 201, result, schemaKeys);
    });
  };

  // Get community by uuid
  this.getCommunity = (req, res) => {
    // Find community by uuid
    Community.findOne({ uuid: req.params.uuid }, (err, result) => {
      // Return error status
      if (err) {
        return handlers.sendResponseData(res, 400);
      }

      // Return result
      if (result) {
        return handlers.sendResponseData(res, 200, result, schemaKeys);
      }

      // Return not found status
      return handlers.sendResponseData(res, 404);
    });
  };

  // Get all communities
  this.getCommunities = (req, res) => {
    // Find all communities
    Community.find({}, (err, result) => {
      // Return error status
      if (err) {
        return handlers.sendResponseData(res, 400);
      }

      // Return results
      return handlers.sendResponseData(res, 200, result, schemaKeys);
    });
  };

  // Update community
  this.updateCommunity = (req, res) => {
    // Define updated community object
    let updatedCommunity = {
      name: req.params.name,
      description: req.params.description,
      slug: req.params.name !== undefined ? slug(req.params.name) : undefined,
    };

    // Filter to remove undefined fields
    updatedCommunity = lodash.pickBy(updatedCommunity);

    // Find community by uuid and update
    Community.findOneAndUpdate(
      { uuid: req.params.uuid },
      updatedCommunity,
      { new: true },
      (err, result) => {
        // Return error status
        if (err) {
          return handlers.sendResponseData(res, 400);
        }

        // Return result
        if (result) {
          return handlers.sendResponseData(res, 200, result, schemaKeys);
        }

        // Return not found status
        return handlers.sendResponseData(res, 404);
      });
  };

  // Delete community
  this.deleteCommunity = (req, res) => {
    // Find community by uuid and delete it
    Community.findOneAndRemove({ uuid: req.params.uuid }, (err, result) => {
      // Return error status
      if (err) {
        return handlers.sendResponseData(res, 400);
      }

      // Return success status
      if (result) {
        return handlers.sendResponseData(res, 200);
      }

      // Return not found status
      return handlers.sendResponseData(res, 404);
    });
  };

  return this;
}

export default new CommunityHandler();
