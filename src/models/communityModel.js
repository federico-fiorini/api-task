import mongoose from '../db';
import validate from 'mongoose-validator';

// Community model
export default (function communityModel () {

  // Define validators
  var nameValidator = [
    validate({
      validator: 'isLength',
      arguments: [1, 100],
      message: 'Name should be max 100 characters'
    })
  ];

  var descriptionValidator = [
    validate({
      validator: 'isLength',
      arguments: [1, 200],
      message: 'Description should be max 200 characters'
    })
  ];

  // Define schema
  var schema = {
    uuid: {type: String, required: true},
    name: {type: String, required: true, validate: nameValidator},
    description: {type: String, required: true, validate: descriptionValidator},
    slug: {type: String, required: true},
    creationDate: {type: Date, default: Date.now}
  };

  // Create mongoose model
  var communitySchema = mongoose.Schema(schema);
  var community = mongoose.model('community', communitySchema);

  return community;
})();
