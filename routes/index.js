'use strict';
const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const User = require('../models/user');

router.get('/', (req, res) => {
  res.render('landing');
});

// ===========
// AUTH ROUTES
// ===========

// Show register form
router.get('/register', (req, res) => {
  res.render('accounts/register');
});

// Handle sign up logic
router.post('/register', (req, res) => {
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
router.get('/login', (req, res) => {
  res.render('accounts/login');
});

// Handling login logic
router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/gyms',
    failureRedirect: '/login'
  }), (req, res) => {});

// Logout logic
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/gyms');
});

// Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
