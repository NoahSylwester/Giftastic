// attach elements to variables via jquery
var buttonDisplay = $('.button-display');
var gifDisplay = $('.gif-display');

// initialize topics array
var topics = ["kittens", "puppies", "ducklings", "wombats", "bear cubs", 'ferrets'];
var arr = [];
var newTopic = "";

// initialize favorites array
var favorites = [];
var favoritesStorage;

// define functions

  // fills favorites area on initial load from local storage
  function fillFavoritesFromLocalStorage() {
    favoritesStorage = JSON.parse(localStorage.getItem('favorites'));
    for (let i = 0; i < favoritesStorage.length; i++) {
      let storedElement = $(
        `
        <div class="gif fav-gif" data-id="${favoritesStorage[i].id}">
          ${favoritesStorage[i].html}
        </div>
        `
        );
      favorites.push(storedElement);
    }
    $('.favorites').empty().append(favorites);
  }

  // localStorage update
  function updateLocalStorage() {
    favoritesStorage = [];
    for (let i = 0; i < favorites.length; i++) {
      let favObject = {
        id: favorites[i].data('id'),
        html: favorites[i].html()
      }
      favoritesStorage.push(favObject);
    }
    localStorage.clear();
    localStorage.setItem("favorites", JSON.stringify(favoritesStorage));
  };

  // update .buttons-view
  function updateButtons() {
    arr = [];
    topics.forEach((topic) => {
      arr.push($(`<button class="btn btn-sm btn-primary btn-topic">${topic}</button>`));
    })
    buttonDisplay.empty().append(...arr);
  };

  // update .gifs-view
  function updateGifs(keyword) {
    arr = [];
    let queryUrl = "https://api.giphy.com/v1/gifs/search?api_key=nQtvdLS8RFmfo0CBFedERtrhHTq8NXas&q=" + keyword + "&limit=10";
    $.ajax({ // call the giphy API
      url: queryUrl,
      method: "GET"
    }).then((response) => {
      console.log(response);
      response.data.forEach((gif) => {
        arr.push($(`<div class="gif" data-id="${gif.id}"><i class="fas fa-heart not-favorite"></i><p class="gif-rating">Title: ${gif.title}<br />Rating: ${gif.rating}<br /><a href="${gif.source_post_url}">Source</a></p><img class="gif-image" alt="gif" src="${gif.images.downsized_still.url}" data-still="${gif.images.downsized_still.url}" data-animate="${gif.images.downsized.url}" zoom="false"></div>`))
      });
      
      gifDisplay.empty().append(...arr);
    }).then(() => {
      // synchronize with favorites
      var displayHearts = $('.gif-display .gif .fa-heart');
      var favHearts = [];
      $('.favorites .fav-gif .fa-heart').each((index) => {
        favHearts.push($($('.favorites .fav-gif .fa-heart')[index]).parent().data('id'));
      });
      displayHearts.each((index) => {
      if (favHearts.includes($(displayHearts[index]).parent().data('id'))) {
        $(displayHearts[index]).removeClass('not-favorite').addClass('favorite');
      };
    });
  });
};

  // search function for giphy api user input terms
  function userSubmit() {
    newTopic = $(".text-input").val().trim(); // grab text from the input box
    if (!topics.includes(newTopic) && newTopic !== "") {
      topics.push(newTopic);
    }
    $('.text-input').val("");
  }

  // animate gif for click event
  function animateGif(gif) {
    if ($(gif).attr('src').search(/_s\.gif/) !== -1) {
      $(gif).attr({"src":$(gif).data('animate')});
    }
    else {
      $(gif).attr({"src":$(gif).data('still')});
    }
  }
  function displayFavorites() {
    let favGifDisplay = [];
    let displayVersion;
    for (let i = 0; i < favorites.length; i++) {
      displayVersion = favorites[i].clone().removeClass('fav-gif');
      displayVersion.children('.gif-rating').removeClass('hidden');
      displayVersion.children('.gif-image').removeClass('fav-gif-image');
      favGifDisplay.push(displayVersion);
    }
    gifDisplay.empty().append(...favGifDisplay);
  }


// event listeners for buttons
buttonDisplay.on("click", ".btn-topic", function(event) { // pressing a topic button
  event.preventDefault();
  updateGifs($(this).text());
});

$('.user-submit').on("click", function(event) { // submitting user typed search keyword
  event.preventDefault();
  userSubmit();
  updateButtons();
  if (newTopic !== ""){
    updateGifs(newTopic);
  }
});

gifDisplay.on("click", ".gif-image", function(event) { // animate gif
  animateGif(this);
})

gifDisplay.on("dblclick", ".gif-image", function(event) { // zoom/unzoom for main content
  if ($(this).attr('zoom') === "false") {
    $(this).parent().addClass('main-zoom'); // zoom
    $(this).attr({'zoom':'true'});
  }
  else if ($(this).attr('zoom') === "true") {
    $(this).parent().removeClass('main-zoom'); // unzoom
    $(this).attr({'zoom':'false'});
  }
})

$('.favorites-holder').on("click", ".fav-gif-image", function(event) { // animate fav gif
  animateGif(this);
})

$('.favorites-holder').on("dblclick", ".fav-gif-image", function(event) { // zoom/unzoom for favorites
  if ($(this).attr('zoom') === "false") {
    $(this).parent().addClass('fav-zoom'); // zoom
    $(this).attr({'zoom':'true'});
  }
  else if ($(this).attr('zoom') === "true") {
    $(this).parent().removeClass('fav-zoom'); // unzoom
    $(this).attr({'zoom':'false'});
  }
})

// code for favorites system
gifDisplay.on("click", ".not-favorite", function(event) { // add favorite
  $(this).removeClass('not-favorite').addClass('favorite');
  if (!favorites.includes($(this).parent())){
    let favGif = $(this).parent().clone().addClass('fav-gif');
    favGif.children('.gif-rating').addClass('hidden');
    favGif.children('.gif-image').addClass('fav-gif-image');
    favorites.push(favGif);
  }
  $('.favorites').empty().append(favorites);
  updateLocalStorage();
});

gifDisplay.on("click", ".favorite", function(event) { // remove favorite
  let index;
  $(this).removeClass('favorite').addClass('not-favorite');
  for (let i = 0; i < favorites.length; i++) {
    if ($(this).parent().data('id') == $(favorites[i]).data('id')) {
      index = i;
    }
  }
  favorites.splice(index,1);
  $('.favorites').empty().append(favorites);
  updateLocalStorage();
});



$('.favorites-holder').on("click", ".favorite", function(event) { // remove favorite from within favorites holder
  $(this).removeClass('favorite').addClass('not-favorite');
  for (let i = 0; i < favorites.length; i++) {
    if ($(this).parent().data('id') == $(favorites[i]).data('id')) {
      index = i;
    }
  }
  favorites.splice(index,1);
  $('.favorites').empty().append(favorites);

  // synchronizes favorites icon appearance in gif viewer
  var hearts = $('.gif-display .gif .fa-heart');
  hearts.each((index) => {
    console.log($(hearts[index]).parent().data('id'));
    if ($(hearts[index]).parent().data('id') == $(this).parent().data('id')) {
      $(hearts[index]).removeClass('favorite').addClass('not-favorite');
      };
  });
  updateLocalStorage();
});

$('#show-favorites').on('click', function(event) {
  event.preventDefault();
  displayFavorites();
});

// initial function calls
updateButtons();
updateGifs("kittens");
fillFavoritesFromLocalStorage();