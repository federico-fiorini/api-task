import uuidV4 from "uuid/v4";
import lodash from "lodash";
import Community from "api/models/communityModel";
import handlers from "api/handlers";

function CommunityHandler() {
  // Filter results to remove database specific fields
  const schemaKeys = Object.keys(Community.schema.obj);

  // Create new community
  this.createCommunity = async (req, res, next) => {
    // Set community object
    let newCommunity = {
      uuid: uuidV4(),
      name: req.body.name,
      description: req.body.description,
    };

    // Filter to remove undefined fields
    newCommunity = lodash.pickBy(newCommunity);

    try {
      // Query mongo with await and return result
      const result = await Community.create(newCommunity);
      handlers.sendResponseData(res, 201, result, schemaKeys);
    } catch (err) {
      // Return error
      handlers.sendResponseData(res, 400);
    }

    return next();
  };

  // Get community by uuid
  this.getCommunity = async (req, res, next) => {
    try {
      // Find community by uuid
      const result = await Community.findOne({ uuid: req.params.uuid });

      // Return result
      if (result) {
        handlers.sendResponseData(res, 200, result, schemaKeys);
      } else {
        // Return not found status
        handlers.sendResponseData(res, 404);
      }
    } catch (err) {
      // Return error status
      handlers.sendResponseData(res, 400);
    }

    return next();
  };

  // Get all communities
  this.getCommunities = async (req, res, next) => {
    try {
      // Find all communities
      const result = await Community.find({});

      // Return results
      handlers.sendResponseData(res, 200, result, schemaKeys);
    } catch (err) {
      // Return error status
      handlers.sendResponseData(res, 400);
    }

    return next();
  };

  // Update community
  this.updateCommunity = async (req, res, next) => {
    // Check if bad request
    const bodyKeys = Object.keys(req.body);
    for (let i = 0; i < bodyKeys.length; i += 1) {
      // Return bad request if not updatable field
      if (Community.updatableFields.indexOf(bodyKeys[i]) === -1) {
        handlers.sendResponseData(res, 400);
        return next();
      }
    }

    // Define updated community object
    let updatedCommunity = {
      name: req.body.name,
      description: req.body.description,
    };

    // Filter to remove undefined fields
    updatedCommunity = lodash.pickBy(updatedCommunity);

    try {
      // Find community by uuid and update
      const result = await Community.findOneAndUpdate(
        { uuid: req.params.uuid },
        updatedCommunity,
        { new: true, runValidators: true },
      );

      // Return result
      if (result) {
        handlers.sendResponseData(res, 200, result, schemaKeys);
      } else {
        // Return not found status
        handlers.sendResponseData(res, 404);
      }
    } catch (err) {
      // Return error status
      handlers.sendResponseData(res, 400);
    }

    return next();
  };

  // Delete community
  this.deleteCommunity = async (req, res, next) => {
    try {
      // Find community by uuid and delete it
      const result = await Community.findOneAndRemove({ uuid: req.params.uuid });

      // Return success status
      if (result) {
        handlers.sendResponseData(res, 200);
      } else {
        // Return not found status
        handlers.sendResponseData(res, 404);
      }
    } catch (err) {
      // Return error status
      handlers.sendResponseData(res, 400);
    }

    return next();
  };

  return this;
}

export default new CommunityHandler();
