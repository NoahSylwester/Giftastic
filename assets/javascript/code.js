// attach elements to variables via jquery
var buttonDisplay = $('.button-display');
var gifDisplay = $('.gif-display');

// initialize topics array
var topics = ["kittens", "puppies", "ducklings", "wombats", "bear cubs", 'ferrets'];
var arr = [];
var newTopic = "";

// define functions

  // update .buttons-view
  function updateButtons() {
    arr = [];
    topics.forEach((topic) => {
      arr.push($(`<button class="btn btn-sm btn-danger btn-topic">${topic}</button>`));
    })
    buttonDisplay.empty().append(...arr);
  };

  // update .gifs-view
  function updateGifs(keyword) {
    arr = [];
    let queryUrl = "https://api.giphy.com/v1/gifs/search?api_key=nQtvdLS8RFmfo0CBFedERtrhHTq8NXas&q=" + keyword + "&limit=10";
    $.ajax({
      url: queryUrl,
      method: "GET"
    }).then((response) => {
      console.log(response);
      response.data.forEach((gif) => {
        arr.push($(`<div class="gif"><p class="gif-rating">Rating: ${gif.rating}</p><img class="gif-image" src="${gif.images.downsized.url}"></div>`))
      });
      gifDisplay.empty().append(...arr);
    });
  };

  // search function for giphy api user input terms
  function userSubmit() {
    newTopic = $(".text-input").val().trim();
    if (!topics.includes(newTopic) && newTopic !== "") {
      topics.push(newTopic);
    }
    $('.text-input').val("");
  }



// event listeners for buttons
buttonDisplay.on("click", ".btn-topic", function(event) {
  event.preventDefault();
  updateGifs($(this).text());
});

$('.user-submit').on("click", function(event) {
  event.preventDefault();
  userSubmit();
  updateButtons();
  if (newTopic !== ""){
    updateGifs(newTopic);
  }
});


// initial function calls
updateButtons();
updateGifs("kittens");