'use strict';
// Requiring dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');

// Requiring files
const secret = require('./config/secret');
const User = require('./models/user');
const seedDb = require('./seeds');
// Requiring routes
const commentRoutes = require('./routes/comments');
const indexRoutes = require('./routes/index');
const gymRoutes = require('./routes/gyms');

// ==========
// APP CONFIG
// ==========
mongoose.Promise = global.Promise;
mongoose.connect(secret.database, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('======================');
    console.log('Connected to the database');
    console.log('======================');
  }
});
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
app.use(cookieParser());
// Require moment
app.locals.moment = require('moment');
// seedDb(); //seed the database

// PASSPORT CONFIGURATION
app.use(require('express-session')({
  resave: false,
  saveUninitialized: false,
  secret: secret.secretKey,
  store: new MongoStore({ url: secret.database, autoReconnect: true })
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', indexRoutes);
app.use('/gyms', gymRoutes);
app.use('/gyms/:id/comments', commentRoutes);

// LISTEN TO PORT
app.listen(secret.port, (err) => {
  if (err) { throw err; }
  console.log('======================');
  console.log('Server is running on port ' + secret.port);
  console.log('======================');
});
