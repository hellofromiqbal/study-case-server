const mongoose = require('mongoose');
const { dbHost, dbPort, dbName, dbUser, dbPass } = require('../app/config');

mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}?authSource=admin`);

const db = mongoose.connection;
module.exports = db;