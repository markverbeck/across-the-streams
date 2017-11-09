function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

var name = getParameterByName("name");
console.log(name);

// display poster on info page
function displayShowPoster() {
  var queryURL = "https://www.omdbapi.com/?t=" + name + "&y=&plot=long&apikey=40e9cece";

  // Creates AJAX call for the specific show button being clicked
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {

    // Creates a div to hold the show
    $("#show-poster").empty();
    // Retrieves the poster Data
    console.log(response);
    var poster = $("<img>");
      poster.addClass("bigPoster");
      poster.attr("src", response.Poster);
      $("#show-poster").append(poster);

  });
};

// display show info on info page
function displayShowInfo() {
  var queryURL = "https://www.omdbapi.com/?t=" + name + "&y=&plot=long&apikey=40e9cece";

  // Creates AJAX call for the specific show button being clicked
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {

    // Creates a div to hold the show
    $("#show-info").empty();
    // Retrieves the title, year, genre, and number of seasons Data
    console.log(response);
    $("#show-info").html("<p>Title: " + response.Title + "</p>");
    $("#show-info").append("<p>Year: " + response.Year + "</p>");
    $("#show-info").append("<p>Actors: " + response.Actors + "</p>");
    $("#show-info").append("<p>Genre: " + response.Genre + "</p");
    $("#show-info").append("<p>Number of Seasons: " + response.totalSeasons + "</p>");
  });
};

// display show plot on info page
function displayShowPlot() {
  var queryURL = "https://www.omdbapi.com/?t=" + name + "&y=&plot=long&apikey=40e9cece";

  // Creates AJAX call for the specific Show button being clicked
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {

    // Creates a div to hold the Show
    $("#show-plot").empty();
    // Retrieves the Plot Data
    console.log(response);
    $("#show-plot").html("<p>Plot: " + response.Plot + "</p>");
  });
};

var displayShowTimes = function(){
    var api = "https://api.tvmaze.com/singlesearch/shows?q=" + name;

    $.ajax({
      url: api,
        method: "GET"
    }).done(function(response){

      $("show-times").empty();
      console.log(response);
      
      var time;
      if(response.schedule.time === "") {
        time = "N/A";
      } 
      else {
        time = convert(response.schedule.time);
        time += " EST";
      }
      
      var network;
      if(response.network === null) {
        network = response.webChannel.name;
      }
      else {
        network = response.network.name;
      }

      $("#show-times").html("<p>Days Scheduled: " + response.schedule.days + "</p>");
      $("#show-times").append("<p>Time: " + time + " (" + response.status + ")</p>");
      $("#show-times").append("<p>Network: " + network + "</p>");
    });

var convert = function (input) {
    return moment(input, 'HH:mm:ss').format('hh:mm A');
  };
};


displayShowPoster();
displayShowInfo();
displayShowPlot();
displayShowTimes();