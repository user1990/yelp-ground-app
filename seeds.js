const mongoose = require('mongoose');
const Gym = require('./models/gym');
const Comment = require('./models/comment');

var data = [
  {
    name: 'Gold GYM',
    image: 'https://cdn.wallpapersafari.com/27/27/lTDrtF.jpg',
    description: 'Gold’s Gym has ranked highest in customer satisfaction in two consecutive J.D. Power surveys'
  },
  {
    name: 'Diamond Gym',
    image: 'http://diamondgym.lt/wp-content/uploads/2016/09/DSC_0456.jpg',
    description: 'Anytime offers a uniquely travel-friendly feature:'
  },
  {
    name: 'Muscle Power',
    image: 'http://www.goldsgym.com/losangelesdtca/wp-content/uploads/sites/505/2016/08/golds-gym-downtown-la-ca-weight-training.jpg',
    description: 'Welcome to Muscle Power, where our only goal is to help you realize yours. Whether you’re ready to join or want to see what it’s like to work out with the number one name in fitness, getting started is easy.'
  }
];

function seedDB() {
  // Remove all Gyms
  Gym.remove({}, err => {
    if (err) {
      console.log(err);
    }
    console.log('removed gym!');
    // add a few Gyms
    data.forEach(seed => {
      Gym.create(seed, (err, Gym) => {
        if (err) {
          console.log(err);
        } else {
          console.log('added a gym');
          // create a comment
          Comment.create(
            {
              text: 'This place is great, but I wish there was internet',
              author: 'Homer'
            }, (err, comment) => {
            if (err) {
              console.log(err);
            } else {
              Gym.comments.push(comment);
              Gym.save();
              console.log('Created new comment');
            }
          });
        }
      });
    });
  });
  // add a few comments
}

module.exports = seedDB;
