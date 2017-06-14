'use strict';
const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const User = require('../models/user');

// ROOT
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
      req.flash('error', err.message);
      return res.render('accounts/register');
    }
    passport.authenticate('local')(req, res, function() {
      req.flash('success', 'Successfully Signed Up! Nice to meet you ' + user.username);
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
  req.flash('success', 'See you later!');
  res.redirect('/gyms');
});

module.exports = router;
