import uuidV1 from "uuid/v1";
import slug from "slug";
import Community from "../models/communityModel";

function CommunityHandler() {
  // Create new community
  this.createCommunity = (req, res) => {
    // Set community object
    const newCommunity = {
      uuid: uuidV1(),
      name: req.params.name,
      description: req.params.description,
      slug: slug(req.params.name),
    };

    Community.create(newCommunity, (err, result) => {
      // Return error status
      if (err) {
        res.status(500);
        return res.json({ status: "ERROR" });
      }

      // Return result
      res.status(201);
      return res.json({ status: "OK", data: result });
    });
  };

  // Get community by uuid
  this.getCommunity = (req, res) => {
    // Find community by uuid
    Community.findOne({ uuid: req.params.uuid }, (err, result) => {
      // Return error status
      if (err) {
        res.status(500);
        return res.json({ status: "ERROR" });
      }

      // Return result
      if (result) {
        return res.json({ status: "OK", data: result });
      }

      // Return not found status
      res.status(404);
      return res.json({ status: "OK", data: "Not found" });
    });
  };

  // Get all communities
  this.getCommunities = (req, res) => {
    // Find all communities
    Community.find({}, (err, result) => {
      // Return error status
      if (err) {
        res.status(500);
        return res.json({ status: "ERROR" });
      }

      // Return results
      return res.json({ status: "OK", data: result });
    });
  };

  // Update community
  this.updateCommunity = (req, res) => {
    // Define updated community object
    const updatedCommunity = {
      name: req.params.name,
      description: req.params.description,
      slug: slug(req.params.name),
    };

    // Find community by uuid and update
    Community.findOneAndUpdate(
      { uuid: req.params.uuid },
      updatedCommunity,
      { new: true },
      (err, result) => {
        // Return error status
        if (err) {
          res.status(500);
          return res.json({ status: "ERROR" });
        }

        // Return result
        if (result) {
          return res.json({ status: "OK", data: result });
        }

        // Return not found status
        res.status(404);
        return res.json({ status: "OK", data: "Not found" });
      });
  };

  // Delete community
  this.deleteCommunity = (req, res) => {
    // Find community by uuid and delete it
    Community.findOneAndRemove({ uuid: req.params.uuid }, (err) => {
      // Return error status
      if (err) {
        res.status(500);
        return res.json({ status: "ERROR" });
      }

      // Return success status
      return res.json({ status: "OK" });
    });
  };

  return this;
}

export default new CommunityHandler();
