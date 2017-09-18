const mongoose = require('mongoose');

module.exports = mongoose.model('User', new mongoose.Schema({
  username: String,
  cohort: String,
  avatar_url: String,
  gh_team_id: String
}));
