// attach elements to variables via jquery
var buttonDisplay = $('.button-display');
var gifDisplay = $('.gif-display');

// initialize topics array
var topics = ["kittens", "puppies", "goslings", "wombats", "bear cubs"];
var arr = [];

// define functions

  // query giphy api
  function apiQuery(keyword) {
    let queryUrl = "api.giphy.com/v1/gifs/search?api_key=nQtvdLS8RFmfo0CBFedERtrhHTq8NXas&q=" + keyword + "&limit=10";
    $.ajax({
      url: queryUrl,
      method: "GET"
    }).then((response) => {
      console.log(response);
    });
  };

  // update .buttons-view
  function updateButtons() {
    arr = [];
    topics.forEach((topic) => {
      arr.push($(`<button class="btn btn-sm btn-danger btn-topic">${topic}</button>`));
    })
    buttonDisplay.empty().append(...arr);
  };

  // update .gifs-view
  function updateGifs() {
    gifDisplay.empty().append();
  };

  // search giphy api user input terms

  updateButtons();