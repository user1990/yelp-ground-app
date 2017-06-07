'use strict';
const express = require('express');

// Initialize app
const app = express();

// Initialize ejs template
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/grounds', (req, res) => {
  let restgrounds = [
    { name: 'Hogwash', image: 'http://info.orwakbalers.com/hubfs/Blog%20&%20email%20images/blog%20Images/restaurant.jpeg' },
    { name: 'Media Noche', image: 'https://media-cdn.tripadvisor.com/media/photo-s/06/ac/70/5e/fardi-syrian-restaurant.jpg' },
    { name: 'Tacorea', image: 'http://bsnscb.com/data/out/163/27009665-restaurant-wallpapers.jpg' }
  ];
});

// Listen to port
app.listen(3000, (err) => {
  if (err) { throw err; }
  console.log('=========================');
  console.log('Server is running on port');
  console.log('=========================');
});
