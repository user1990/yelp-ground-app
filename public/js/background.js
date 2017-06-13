var counter = 0;

function changeBG() {
  var images = [
    'url(../images/third.jpg)',
    'url(../images/first.jpg)',
    'url(../images/second.jpg)',
    'url(../images/fourth.jpg)'
  ];

  if (counter === images.length) {
    counter = 0;
  }
  document.body.style.backgroundImage = images[counter];

  counter++;
}

setInterval(changeBG, 4000);
