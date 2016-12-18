import mongoose from 'mongoose';
import config from '../config';
import winston from "winston";

// Connect to mongodb
mongoose.connect(config.dbPath);
var db = mongoose.connection;

// Define event listeners
db.on('error', function () {
	winston.log('error', 'Error occured from db');
});

db.once('open', function dbOpen() {
	winston.log('info', 'successfully opened the db');
});

export default mongoose;
