'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var gyms = [
        { name: 'Salmon Creek', image: 'https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg' },
        { name: 'Granite Hill', image: 'https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg' },
        { name: 'Mountain Goat\'s Rest', image: 'https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg' },
        { name: 'Salmon Creek', image: 'https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg' },
        { name: 'Granite Hill', image: 'https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg' },
        { name: 'Mountain Goat\'s Rest', image: 'https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg' },
        { name: 'Salmon Creek', image: 'https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg' },
        { name: 'Granite Hill', image: 'https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg' },
        { name: 'Mountain Goat\'s Rest', image: 'https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg' }
];

/* Middleware */
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

/** ROUTES **/
app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/gyms', (req, res) => {
  res.render('gyms', { gyms: gyms });
});

app.post('/gyms', (req, res) => {
  // get data from form and add to gyms array
  let name = req.body.name;
  let image = req.body.image;
  let newGym = { name: name, image: image };
  gyms.push(newGym);
  // redirect back to gyms page
  res.redirect('/gyms');
});

app.get('/gyms/new', (req, res) => {
  res.render('new.ejs');
});

/* Listen to port */
app.listen(3000, (err) => {
  if (err) { throw err; }
  console.log('=========================');
  console.log('Server is running on port');
  console.log('=========================');
});
