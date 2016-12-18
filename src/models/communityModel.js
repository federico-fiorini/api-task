import mongoose from '../db';
import validate from 'mongoose-validator';

// Community model
export default (function communityModel () {

  // Define schema
	var schema = {
		uuid: {type: String, required: true},
		name: {type: String, required: true},
		description: {type: String, required: true},
		slug: {type: String, required: true},
		creationDate: {type: Date, default: Date.now}
	};

  // Create mongoose model
	var communitySchema = mongoose.Schema(schema);
	var community = mongoose.model('community', communitySchema);

	return community;
})();
