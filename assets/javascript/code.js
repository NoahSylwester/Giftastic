// attach elements to variables via jquery
var buttonDisplay = $('.button-display');
var gifDisplay = $('.gif-display');

// initialize topics array
var topics = ["kittens", "puppies", "ducklings", "wombats", "bear cubs", 'ferrets'];
var arr = [];
var newTopic = "";

// initialize favorites array
var favorites = [];

// initialize zoom boolean
var zoom = false;


// define functions

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
        arr.push($(`<div class="gif" data-id="${gif.id}"><i class="fas fa-heart not-favorite"></i><p class="gif-rating">Title: ${gif.title}<br />Rating: ${gif.rating}<br /><a href="${gif.source_post_url}">Source</a></p><img class="gif-image" alt="gif" src="${gif.images.downsized_still.url}" data-still="${gif.images.downsized_still.url}" data-animate="${gif.images.downsized.url}"></div>`))
      });
      gifDisplay.empty().append(...arr);
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
    if ($(gif).attr('src').search(/giphy_s/) !== -1) {
    // var alt = $(gif).data('alt'); // temporarily store the alt value
      // $(gif).data("animate", $(gif).attr('src')); // switch the src with the data-alt, works in reverse too once the gif is running
      $(gif).attr({"src":$(gif).data('animate')});
    }
    else {
      $(gif).attr({"src":$(gif).data('still')});
    }
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
  if (!zoom) {
    $(this).parent().css({"width":'100%'}); // zoom
    zoom = true;
  }
  else if (zoom) {
    $(this).parent().css({"width":'30%'}); // unzoom
    zoom = false;
  }
})

$('.favorites-holder').on("click", ".fav-gif-image", function(event) { // animate fav gif
  animateGif(this);
})

$('.favorites-holder').on("dblclick", ".fav-gif-image", function(event) { // zoom/unzoom for favorites
  if (!zoom) {
    $(this).parent().css({"height":'150px'}); // zoom
    zoom = true;
  }
  else if (zoom) {
    $(this).parent().css({"height":'60px'}); // unzoom
    zoom = false;
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
});

// initial function calls
updateButtons();
updateGifs("kittens");