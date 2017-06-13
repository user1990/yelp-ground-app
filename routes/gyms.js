'use strict';
const express = require('express');
const router = express.Router();
const Gym = require('../models/gym');
const middleware = require('../middleware');

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
router.post('/', middleware.isLoggedIn, (req, res) => {
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
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('gyms/new');
});

// SHOW -shows more info about one gym
router.get('/:id', (req, res) => {
  Gym.findById(req.params.id).populate('comments').exec(function(err, foundGym) {
    if (err) {
      console.log(err);
    } else {
      console.log(foundGym);
      res.render('gyms/show', { gym: foundGym });
    }
  });
});

// EDIT GYM
router.get('/:id/edit', middleware.checkGymOwnership, (req, res) => {
  Gym.findById(req.params.id, (err, foundGym) => {
    res.render('gyms/edit', { gym: foundGym });
  });
});

// UPDATE GYM
router.put('/:id', middleware.checkGymOwnership, (req, res) => {
  // find and update the correct gym
  Gym.findByIdAndUpdate(req.params.id, req.body.gym, (err, updatedGym) => {
    if (err) {
      res.redirect('/gyms');
    } else {
           // redirect somewhere(show page)
      res.redirect('/gyms/' + req.params.id);
    }
  });
  // redirect somewhere
});

// DESTROY GYM
router.delete('/:id', middleware.checkGymOwnership, (req, res) => {
  Gym.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect('/gyms');
    } else {
      res.redirect('/gyms/' + req.params.id);
    }
  });
});

module.exports = router;
