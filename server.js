const path = require('path');
const express = require('express');
const partials = require('express-partials');
const bodyParser = require('body-parser');
const session = require('express-session');
const router = require('./routes');
const passport = require('./services/passport');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

module.exports = app;
