const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const gh = require('./githubApi');
const User = require('../models/user');
const jwt = require('jwt-simple');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

const config = {
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.LOGIN_CALLBACK_URL
};
passport.use(new GitHubStrategy(config, function(accessToken, refreshToken, profile, done) {
  User.findOne({ username: profile.username })
    .then(user => {
      profile = Object.assign({}, profile, {
        cohort: user.cohort,
        _id: user._id,
        gh_team_id: user.gh_team_id
      });
      return Promise.all([user, gh.orgs.getTeamMembership({ id: user.gh_team_id, username: user.username })]);
    })
    .then(([user, {data}]) => {
      if (data.role === 'member') {
        const token = jwt.encode({
          sub: user._id,
          admin: false
        }, process.env.JWT_SECRET);
        profile.jwt = token;
        return done(null, profile);
      }
      console.log('**************');
      console.log(data.role);
      console.log('**************');
    })
    .catch(done);
}));

module.exports = passport;
