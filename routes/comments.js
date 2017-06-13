'use strict';
const express = require('express');
const router = express.Router({ mergeParams: true });
const Gym = require('../models/gym');
const Comment = require('../models/comment');
const middleware = require('../middleware');

// ====================
// COMMENTS ROUTES
// ====================

router.get('/new', middleware.isLoggedIn, (req, res) => {
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

// COMMENT EDIT ROUTE
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err) {
      res.redirect('back');
    } else {
      res.render('comments/edit', { gym_id: req.params.id, comment: foundComment });
    }
  });
});

// COMMENT UPDATE
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/gyms/' + req.params.id);
    }
  });
});

// COMMENT DESTROY ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
    // findByIdAndRemove
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/gyms/' + req.params.id);
    }
  });
});

module.exports = router;
