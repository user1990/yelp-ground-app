'use strict';
const express = require('express');
const router = express.Router({ mergeParams: true });
const Gym = require('../models/gym');

// INDEX - show all gyms
router.get('/', (req, res) => {
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
router.post('/', isLoggedIn, (req, res) => {
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  let newGym = { name: name, image: image, description: desc, author: author };
  Gym.create(newGym, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/gyms');
    }
  });
});

// NEW - show form to create new gym
router.get('/new', isLoggedIn, (req, res) => {
  res.render('gyms/new');
});

// SHOW -shows more info about one gym
router.get('/:id', (req, res) => {
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

// Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
