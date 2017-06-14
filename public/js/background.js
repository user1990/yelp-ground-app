var counter = 0;

function changeBG() {
  var images = [
    'url(../images/third.jpg)'
  ];

  if (counter === images.length) {
    counter = 0;
  }
  document.body.style.backgroundImage = images[counter];

  counter++;
}

setInterval(changeBG, 0);
