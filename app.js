'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);

const secret = require('./config/secret');
const Gym = require('./models/gym');
const Comment = require('./models/comment');
const seedDb = require('./seeds');

// APP CONFIG
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

// ==============
// RESTFUL ROUTES
// ==============
app.get('/', (req, res) => {
  res.render('landing');
});

// INDEX - show all gyms
app.get('/gyms', (req, res) => {
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

app.get('/gyms/:id/comments/new', (req, res) => {
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

// LISTEN TO PORT
app.listen(secret.port, (err) => {
  if (err) { throw err; }
  console.log('======================');
  console.log('Server is running on port ' + secret.port);
  console.log('======================');
});
