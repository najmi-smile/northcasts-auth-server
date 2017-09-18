const GitHubApi = require('github');
require('dotenv').config();

const gh = new GitHubApi({
  Promise: global.Promise
});

gh.authenticate({
  type: 'basic',
  username: process.env.GH_USERNAME,
  password: process.env.GH_PASSWORD
});

module.exports = gh;
