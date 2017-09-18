const express = require('express');
const passport = require('../services/passport');

const router = express.Router();

router.get('/', function(req, res){
  res.send({status: 'ok'});
});

router.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email', 'read:org' ] }),
  () => {});

router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.send({jwt: req.user.jwt});
  });

module.exports = router;

