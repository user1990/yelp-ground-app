'use strict';
const express = require('express');
const router = express.Router({ mergeParams: true });
const Gym = require('../models/gym');
const Comment = require('../models/comment');
const middleware = require('../middleware');

// NEW COMMENT
router.get('/new', middleware.isLoggedIn, (req, res) => {
  // Find gym by id
  console.log(req.params.id);
  Gym.findById(req.params.id, (err, gym) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { gym: gym });
    }
  });
});

// CREATE COMMENT
router.post('/', middleware.isLoggedIn, (req, res) => {
   // Lookup gym using ID
  Gym.findById(req.params.id, (err, gym) => {
    if (err) {
      console.log(err);
      res.redirect('/gyms');
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash('error', 'Something went wrong');
          console.log(err);
        } else {
          // Add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // Save comment
          comment.save();
          gym.comments.push(comment);
          gym.save();
          console.log(comment);
          req.flash('success', 'Created a comment!');
          res.redirect('/gyms/' + gym._id);
        }
      });
    }
  });
});

// EDIT COMMENT
router.get('/:comment_id/edit', middleware.checkUserComment, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      req.flash('error', 'Comment was not found');
      res.redirect('back');
    } else {
      res.render('comments/edit', { gym_id: req.params.id, comment: foundComment });
    }
  });
});

// UPDATE COMMENT
router.put('/:comment_id', middleware.checkUserComment, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if (err) {
      req.flash('error', 'Comment was not found');
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted');
      res.redirect('/gyms/' + req.params.id);
    }
  });
});

// DESTROY COMMENT
router.delete('/:comment_id', middleware.checkUserComment, (req, res) => {
    // FindByIdAndRemove
  Comment.findByIdAndRemove(req.params.commentId, (err, comment) => {
    if (err) {
      console.log(err);
    } else {
      Gym.findByIdAndUpdate(req.params.id, {
        $pull: {
          comments: comment.id
        }
      }, function(err) {
        if (err) {
          console.log(err);
        } else {
          req.flash('error', 'Comment deleted!');
          res.redirect('/gyms/' + req.params.id);
        }
      });
    }
  });
});

module.exports = router;
