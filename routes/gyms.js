'use strict';
const express = require('express');
const router = express.Router();
const Gym = require('../models/gym');
const Comment = require('../models/comment');
const middleware = require('../middleware');
const geocoder = require('geocoder');

// Define escapeRegex function for search feature
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// INDEX - show all gyms
router.get('/', function(req, res) {
  if (req.query.search && req.xhr) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all campgrounds from DB
    Gym.find({ name: regex }, function(err, allGyms) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json(allGyms);
      }
    });
  } else {
      // Get all Gyms from DB
    Gym.find({}, function(err, allGyms) {
      if (err) {
        console.log(err);
      } else {
        if (req.xhr) {
          res.json(allGyms);
        } else {
          res.render('gyms/index', { gyms: allGyms, page: 'gyms' });
        }
      }
    });
  }
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
  let cost = req.body.cost;
  geocoder.geocode(req.body.location, (err, data) => {
    let lat = data.results[0].geometry.location.lat;
    let lng = data.results[0].geometry.location.lng;
    let location = data.results[0].formatted_address;
    let newGym = {
      name: name,
      image: image,
      description: desc,
      cost: cost,
      author: author,
      location: location,
      lat: lat,
      lng: lng
    };
    // Create a new campground and save to DB
    Gym.create(newGym, (err, newlyCreated) => {
      if (err) {
        console.log(err);
      } else {
        // Redirect back to campgrounds page
        console.log(newlyCreated);
        res.redirect('/gyms');
      }
    });
  });
});

// NEW - show form to create new gym
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('gyms/new');
});

// SHOW -shows more info about one gym
router.get('/:id', (req, res) => {
  // Find the gym with provided ID
  Gym.findById(req.params.id).populate('comments').exec(function(err, foundGym) {
    if (err) {
      console.log(err);
    } else {
      console.log(foundGym);
      // Render show template with that gym
      res.render('gyms/show', { gym: foundGym });
    }
  });
});

// EDIT GYM
router.get('/:id/edit', middleware.checkUserGym, (req, res) => {
    // find the gym with provided ID
  Gym.findById(req.params.id, function(err, foundGym) {
    if (err) {
      console.log(err);
    } else {
      // render show template with that gym
      res.render('gyms/edit', { gym: foundGym });
    }
  });
});

// UPDATE GYM
router.put('/:id', function(req, res) {
  geocoder.geocode(req.body.location, (err, data) => {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      cost: req.body.cost,
      location: location,
      lat: lat,
      lng: lng
    };
    Gym.findByIdAndUpdate(req.params.id, { $set: newData }, (err, gym) => {
      if (err) {
        req.flash('error', err.message);
        res.redirect('back');
      } else {
        req.flash('success', 'Successfully Updated!');
        res.redirect('/gyms/' + gym._id);
      }
    });
  });
});

// DESTROY GYM
router.delete('/:id', function(req, res) {
  Gym.findByIdAndRemove(req.params.id, (err, gym) => {
    Comment.remove({
      _id: {
        $in: gym.comments
      }
    }, (err, comments) => {
      req.flash('error', gym.name + ' deleted!');
      res.redirect('/gyms');
    });
  });
});

module.exports = router;
