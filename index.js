/* eslint-disable no-console */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./server');

mongoose.connect(process.env.DB_URI, { useMongoClient: true }, err => {
  if (err) return console.error('❌', err);
  console.info(`✅ Connected to database ${process.env.DB_URI}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function (err) {
  if (err) return console.error(err);
  console.info(`Server listening on port ${PORT}...`);
});
