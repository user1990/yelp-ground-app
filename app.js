'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const secret = require('./config/secret');

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
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secret.secretKey,
  store: new MongoStore({ url: secret.database, autoReconnect: true })
}));

// MONGOOSE/MODEL CONFIG
let gymSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

let Gym = mongoose.model('gym', gymSchema);

/** RESTFUL ROUTES **/
app.get('/', (req, res) => {
  res.render('landing');
});

// INDEX - show all gyms
app.get('/gyms', (req, res) => {
  Gym.find({}, (err, allGyms) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { gyms: allGyms });
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
  res.render('new.ejs');
});

// SHOW -shows more info about one gym
app.get('/gyms/:id', (req, res) => {
  Gym.findById(req.params.id, (err, foundGym) => {
    if (err) {
      console.log(err);
    } else {
      res.render('show', { gym: foundGym });
    }
  });
});

// LISTEN TO PORT
app.listen(secret.port, (err) => {
  if (err) { throw err; }
  console.log('======================');
  console.log('Server is running on port ' + secret.port);
  console.log('======================');
});
