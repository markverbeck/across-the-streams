// initialize firebase
var config = {
  apiKey: "AIzaSyAUfx2zzGieGetCyObO9plSOpAY1pEUpvo",
  authDomain: "across-the-streams.firebaseapp.com",
  databaseURL: "https://across-the-streams.firebaseio.com",
  projectId: "across-the-streams",
  storageBucket: "across-the-streams.appspot.com",
  messagingSenderId: "249811555949"
};

firebase.initializeApp(config);

// firebase variables
var database = firebase.database();
var ref; 

// global variables
var listName;
var showNames = [];  // may not need this as soon as we get fb pulls working
var showCounter = 0;
var user;

var houndURL = "https://api.mediahound.com/1.2/security/oauth/authorize?response_type=token&client_id={mhclt_across-the-streams}&client_secret={qZRhyECF7qz72i5veWNqTd68wrbwepwQL71P0bJNgTTfrdaw}&scope=public_profile+user_likes&redirect_uri=http://localhost";

// document ready
$(document).ready(function(){

  // The FirebaseUI config.
  function getUiConfig() {
    return {
      'signInSuccessUrl': 'index.html',
      'signInFlow': 'redirect',
      'signInOptions': [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      // Terms of service url.
      'tosUrl': 'https://www.google.com'
    };
  }

  // Initialize the FirebaseUI Widget using Firebase.
  var currentUser = null;

  // Displays the UI for a signed in user.
  var handleSignedInUser = function(user) {
    $("#user-signed-in").removeClass();
    $("#user-signed-in").addClass("show");
    $("#user-signed-out").removeClass();
    $("#user-signed-out").addClass("hidden");
    $("#name").text(user.displayName);
    uid = user.uid;
  };

  // Displays the UI for a signed out user.
  var handleSignedOutUser = function() {
    $("#user-signed-in").removeClass();
    $("#user-signed-in").addClass("hidden");
    $("#user-signed-out").removeClass();
    $("#user-signed-out").addClass("show");
  };

  // Listen to change in auth state so it displays the correct UI for when
  // the user is signed in or not.
  firebase.auth().onAuthStateChanged(function(user) {
    $("#loading").removeClass();
    $("#loading").addClass("hidden");
    $("#loaded").removeClass();
    $("#loaded").addClass("show");
    user ? handleSignedInUser(user) : handleSignedOutUser();
  });

  // Initializes the FirebaseUI app.
  var initApp = function() {
    document.getElementById('sign-out').addEventListener('click', function() {
      firebase.auth().signOut();
    });
    if (currentUser != null) {
      handleSignedInUser(currentUser);
    }
  };

  window.addEventListener('load', initApp);
// END FIREBASE LOGIN <-------

  user = sessionStorage.getItem("user");
  ref = database.ref(user + "/shows");

  // get shows from db
  ref.on("child_added", function(snapshot) {

    var showData = snapshot.val();
    var currentURL = showData.showURL;

    console.log(currentURL);

    $.ajax({
    url: currentURL,
    method: "GET"
    }).done(function(response) {
      
      console.log(response.Poster);
      console.log(response.Title);

      // add href to poster/title
      var a = $("<a>");
      a.attr("href", "info.html");

      //new div for show
      var div = $("<div>");
      div.addClass("pull-left show-div");
      div.attr("data-show", response.Title);

      // poster for the show
      var poster = $("<img>");
      poster.attr("href", "/info.html");
      poster.addClass("thumbnail");
      poster.attr("src", response.Poster);
      poster.attr("width", "150");

      //del button 
      var deleteButton = $("<button>").addClass("btn-sm btn-danger delete-button");
      deleteButton.html("X");
      deleteButton.attr("data-show", response.Title);

      //title 
      var title = $("<h3>");
      title.text(response.Title);

      //append img and delete button to div
      div.append(deleteButton);
      div.append(a);
      a.append(poster);
      a.append(title);
      $("#list").append(div);

      // add shows to array
      showNames[showCounter] = response.Title;
      showCounter++; 
    });
  });

  // submit button
  $("#submit").on("click", function(){
    event.preventDefault();
    listName = $("#listItem").val().trim();

    //show poster as clickable item in library (#list)
    console.log(listName);
    populateShows(listName);

    $("#listItem").val("");
  });

  // delete button
  $(document).on("click", ".delete-button", function(){
    $(this).parent().remove();

    // ------ > add code for removal from firebase here
  }); 

  // // temp login - remove after fb auth is working
  // $("#temp-login").on("click", function(){
  //   event.preventDefault();
  //   user = $("#temp-login-input").val().trim();

  //   //show poster as clickable item in library (#list)
  //   console.log(user);
  //   saveUserSession(user);    

  //   $("#temp-login-input").val("");

  //   location.href = "index.html";
  // });

});  // end of document.ready!


//save show name and apiurl to local
function saveShowLocalInfo(apiURL, showName) {
  localStorage.setItem("name", showName);
  localStorage.setItem("url", apiURL);

  console.log(localStorage);
}

//save user name to sessionStorage
function saveUserSession(userName) {
  sessionStorage.setItem("user", userName);

  console.log(sessionStorage);
}

// populate show searched in list ID after search
function populateShows(show) {
    var showURL = "https://www.omdbapi.com/?t=" + show + "&y=&plot=long&apikey=40e9cece";
    console.log(showURL);

    $.ajax({
    url: showURL,
    method: "GET"
    }).done(function(response) {
      
      console.log(response.Poster);
      console.log(response.Title);

      // add href to poster/title
      var a = $("<a>");
      a.attr("href", "info.html?name="+response.Title);


      //new div for show
      var div = $("<div>");
      div.addClass("pull-left show-div");
      div.attr("data-show", response.Title);

      // poster for the show
      var poster = $("<img>");
      poster.attr("href", "/info.html");
      poster.addClass("thumbnail");
      poster.attr("src", response.Poster);
      poster.attr("width", "150");

      //del button 
      var deleteButton = $("<button>").addClass("btn-sm btn-danger delete-button");
      deleteButton.html("X");
      deleteButton.attr("data-show", response.Title);

      //title 
      var title = $("<h3>");
      title.addClass("showLink")
      title.text(response.Title);

      //append img and delete button to div
      div.append(deleteButton);
      div.append(a);
      a.append(poster);
      a.append(title);
      $("#list").append(div);

      //push show to shows db
      var userRef = uid + "/shows/";
      database.ref(userRef).push({
        showName: response.Title,
        showURL: showURL,
      });

    //save user uid to session storage
    saveUserSession(uid);
  });
}

//   // submit button
//   $("#submit").on("click", function(){
//     event.preventDefault();
//     listName = $("#listItem").val().trim();

//     //show poster as clickable item in library (#list)
//     console.log(listName);
//     populateShows(listName);

//     $("#listItem").val("");
//   });

//   // delete button
//   $(document).on("click", ".delete-button", function(){
    
//     console.log(this.data-show);

//     $(this).parent().remove();

//     //remove from db
//     database.ref(this.value).remove();
//   }); 

//   // temp login - remove after fb auth is working
//   $("#temp-login").on("click", function(){
//     event.preventDefault();
//     user = $("#temp-login-input").val().trim();

//     //show poster as clickable item in library (#list)
//     console.log(user);
//     saveUserSession(user);
//   }); 

// //
// function displayShowPoster() {
//   var show = $(this).attr("data-name");
//   var queryURL = "https://www.omdbapi.com/?t=" + show + "&y=&plot=long&apikey=40e9cece";


//   // Creates AJAX call for the specific movie button being clicked
//   $.ajax({
//     url: queryURL,
//     method: "GET"
//   }).done(function(response) {

//     // Creates a div to hold the movie
//     $(".show-poster").empty();
//     // Retrieves the Rating Data
//     console.log(response);
//     $("#show-poster").html(response.Poster);
//   });
// }

// function displayShowInfo() {
//   var show = $(this).attr("data-name");
//   var queryURL = "https://www.omdbapi.com/?t=" + show + "&y=&plot=long&apikey=40e9cece";

//   // Creates AJAX call for the specific movie button being clicked
//   $.ajax({
//     url: queryURL,
//     method: "GET"
//   }).done(function(response) {

//     // Creates a div to hold the movie
//     $(".show-info").empty();
//     // Retrieves the Rating Data
//     console.log(response);
//     $("#show-info").html("<p>Title: " + response.Title + "</p>");
//     $("#show-info").html("<p>Year: " + response.Year + "</p>");
//     $("#show-info").html("<p>Genre: " + response.Genre + "</p");
//     $("#show-info").html("<p>Number of Seasons: " + response.totalSeasons + "</p>");
//   });
// }

// function displayShowPlot() {
//   var show = $(this).attr("data-name");
//   var queryURL = "https://www.omdbapi.com/?t=" + show + "&y=&plot=long&apikey=40e9cece";

//   // Creates AJAX call for the specific movie button being clicked
//   $.ajax({
//     url: queryURL,
//     method: "GET"
//   }).done(function(response) {

//     // Creates a div to hold the movie
//     $(".show-plot").empty();
//     // Retrieves the Rating Data
//     console.log(response);
//     $("#show-plot").html("<p>Plot: " + response.Plot + "</p>");
//   });
// }
