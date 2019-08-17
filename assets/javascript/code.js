// attach elements to variables via jquery
var buttonDisplay = $('.button-display');
var gifDisplay = $('.gif-display');

// initialize topics array
var topics = ["kittens", "puppies", "ducklings", "wombats", "bear cubs", 'ferrets'];
var arr = [];
var newTopic = "";

// initialize favorites array
var favorites = [];

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
        arr.push($(`<div class="gif"><i class="fas fa-heart not-favorite"></i><p class="gif-rating">Title: ${gif.title}<br />Rating: ${gif.rating}<br /><a href="${gif.source_post_url}">Source</a></p><img class="gif-image" alt="gif" src="${gif.images.downsized_still.url}" data-alt="${gif.images.downsized.url}"></div>`))
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
    var alt = $(gif).data('alt'); // temporarily store the alt value
    $(gif).data("alt", $(gif).attr('src')); // switch the src with the data-alt, works in reverse too once the gif is running
    $(gif).attr({"src":alt});
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

// code for favorites system
gifDisplay.on("click", ".not-favorite", function(event) { // add favorite
  $(this).removeClass('not-favorite').addClass('favorite');
  if (!favorites.includes($(this).parent())){
    favorites.push($(this).parent());
  }
});

gifDisplay.on("click", ".favorite", function(event) { // remove favorite
  $(this).removeClass('favorite').addClass('not-favorite');
  favorites.splice(favorites[$(this).parent()],1);
});


// initial function calls
updateButtons();
updateGifs("kittens");