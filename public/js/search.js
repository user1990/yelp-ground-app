$('#gym-search').on('input', function() {
  var search = $(this).serialize();
  if (search === 'search=') {
    search = 'all';
  }
  $.get('/gyms?' + search, function(data) {
    $('#gym-grid').html('');
    data.forEach(function(gym) {
      $('#gym-grid').append(`
        <div class="col-md-3 col-sm-6">
          <div class="thumbnail">
            <img src="${ gym.image }">
            <div class="caption">
              <h4>${ gym.name }</h4>
            </div>
            <p>
              <a href="/gyms/${ gym._id }" class="btn btn-primary">More Info</a>
            </p>
          </div>
        </div>
      `);
    });
  });
});

$('#gym-search').submit(function(event) {
  event.preventDefault();
});
