'use strict';
const express = require('express');
const router = express.Router({ mergeParams: true });
const Gym = require('../models/gym');
const Comment = require('../models/comment');

// ====================
// COMMENTS ROUTES
// ====================

router.get('/new', isLoggedIn, (req, res) => {
  // find gym by id
  Gym.findById(req.params.id, (err, gym) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { gym: gym });
    }
  });
});

router.post('/', (req, res) => {
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
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          gym.comments.push(comment);
          gym.save();
          console.log(comment);
          res.redirect('/gyms/' + gym._id);
        }
      });
    }
  });
  // create new comment
  // connect new comment to gym
});

// Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
