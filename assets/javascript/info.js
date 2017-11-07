function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

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
}

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
}

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
}

function displayShowTimes() {
  var queryURL = "http://data.tmsapi.com/v1.1/programs/newShowAirings?lineupId=USA-TX42500-X&startDateTime=2017-11-07T01%3A30Z&endDateTime=2017-11-07T04%3A30Z&includeAdult=false&imageSize=Md&imageAspectTV=2x3&imageText=true&api_key=vvx25ta65sfqyzy3c42sh7pc";
  console.log(queryURL);
}

displayShowPoster();
displayShowInfo();
displayShowPlot();