'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);

const secret = require('./config/secret');
const Gym = require('./models/gym');
const Comment = require('./models/comment');
const User = require('./models/user');
const seedDb = require('./seeds');

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
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secret.secretKey,
  store: new MongoStore({ url: secret.database, autoReconnect: true })
}));
seedDb();

// PASSPORT CONFIGURATION
app.use(require('express-session')({
  secret: 'Time will tell',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// ==============
// RESTFUL ROUTES
// ==============
app.get('/', (req, res) => {
  res.render('landing');
});

// INDEX - show all gyms
app.get('/gyms', (req, res) => {
  // Get all gyms from DB
  Gym.find({}, (err, allGyms) => {
    if (err) {
      console.log(err);
    } else {
      res.render('gyms/index', { gyms: allGyms });
    }
  });
});

// CREATE - add new gym to DB
app.post('/gyms', (req, res) => {
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;
  let newGym = { name: name, image: image, description: desc };
  Gym.create(newGym, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/gyms');
    }
  });
});

// NEW - show form to create new gym
app.get('/gyms/new', (req, res) => {
  res.render('gyms/new');
});

// SHOW -shows more info about one gym
app.get('/gyms/:id', (req, res) => {
  Gym
    .findById(req.params.id)
    .populate('comments')
    .exec((err, foundGym) => {
      if (err) {
        console.log(err);
      } else {
        res.render('gyms/show', { gym: foundGym });
      }
    });
});

// ====================
// COMMENTS ROUTES
// ====================

app.get('/gyms/:id/comments/new', isLoggedIn, (req, res) => {
  // find gym by id
  Gym.findById(req.params.id, (err, gym) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { gym: gym });
    }
  });
});

app.post('/gyms/:id/comments', (req, res) => {
  // lookup gym using ID
  Gym.findById(req.params.id, (err, gym) => {
    if (err) {
      console.log(err);
      res.redirect('/gyms');
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          gym.comments.push(comment);
          gym.save();
          res.redirect('/gyms/' + gym._id);
        }
      });
    }
  });
  // create new comment
  // connect new comment to gym
});

// ===========
// AUTH ROUTES
// ===========

// Show register form
app.get('/register', (req, res) => {
  res.render('accounts/register');
});

// Handle sign up logic
app.post('/register', (req, res) => {
  let newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('accounts/register');
    }
    passport.authenticate('local')(req, res, function() {
      res.redirect('/gyms');
    });
  });
});

// Show login form
app.get('/login', (req, res) => {
  res.render('accounts/login');
});

// Handling login logic
app.post('/login', passport.authenticate('local',
  {
    successRedirect: '/gyms',
    failureRedirect: '/login'
  }), (req, res) => {});

// Logout logic
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/gyms');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// LISTEN TO PORT
app.listen(secret.port, (err) => {
  if (err) { throw err; }
  console.log('======================');
  console.log('Server is running on port ' + secret.port);
  console.log('======================');
});
