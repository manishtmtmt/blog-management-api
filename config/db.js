require("dotenv").config();
const { connect } = require('mongoose')

const uri = process.env.MONGODB_URI;

const connection = connect(uri, {
  useNewUrlParser: true,
  socketTimeoutMS: 30000, // Set a longer timeout, e.g., 30 seconds
});

module.exports = connection;
