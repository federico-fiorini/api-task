import validate from "mongoose-validator";
import mongoose from "api/db";

// Community model
export default (function communityModel() {
  // Define validators
  const nameValidator = [
    validate({
      validator: "isLength",
      arguments: [1, 100],
      message: "Name should be max 100 characters",
    }),
  ];

  const descriptionValidator = [
    validate({
      validator: "isLength",
      arguments: [1, 200],
      message: "Description should be max 200 characters",
    }),
  ];

  // Define schema
  const schema = {
    uuid: { type: String, required: true, unique: true, dropDups: true },
    name: { type: String, required: true, validate: nameValidator },
    description: { type: String, required: true, validate: descriptionValidator },
    slug: { type: String, slug: "name", unique: true },
    creationDate: { type: Date, default: Date.now },
  };

  // Create mongoose model
  const communitySchema = mongoose.Schema(schema);
  const community = mongoose.model("community", communitySchema);

  // Set updatable fields
  community.updatableFields = ["name", "description"];

  return community;
}());
