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
var ref;  // ----> this needs to have reference added for user and be set after authentication

// global variables
var listName;
var showNames = [];
var user;

var houndURL = "https://api.mediahound.com/1.2/security/oauth/authorize?response_type=token&client_id={mhclt_across-the-streams}&client_secret={qZRhyECF7qz72i5veWNqTd68wrbwepwQL71P0bJNgTTfrdaw}&scope=public_profile+user_likes&redirect_uri=http://localhost";

// document ready
$(document).ready(function(){

  user = sessionStorage.getItem("user");
  ref = database.ref(user);

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
    });
  });

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
  var ui = new firebaseui.auth.AuthUI(firebase.auth());

  // The URL of the FirebaseUI standalone widget.
  function getWidgetUrl() {
    return '/widget#recaptcha=' + getRecaptchaMode();
  }

  // Redirects to the FirebaseUI widget.
  var signInWithRedirect = function() {
    window.location.assign(getWidgetUrl());
  };

  // Displays the UI for a signed in user.
  var handleSignedInUser = function(user) {
    $("#user-signed-in").removeClass();
    $("#user-signed-in").addClass("show");
    $("#user-signed-out").removeClass();
    $("#user-signed-out").addClass("hidden");
    $("#name").text(user.displayName);
    $("#email").text(user.email);
  };

  // Displays the UI for a signed out user.
  var handleSignedOutUser = function() {
    $("#user-signed-in").removeClass();
    $("#user-signed-in").addClass("hidden");
    $("#user-signed-out").removeClass();
    $("#user-signed-out").addClass("show");
    ui.start('#firebaseui-container', getUiConfig());
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

  // Deletes the user's account.
  var deleteAccount = function() {
    firebase.auth().currentUser.delete().catch(function(error) {
      if (error.code == 'auth/requires-recent-login') {
        // The user's credential is too old. She needs to sign in again.
        firebase.auth().signOut().then(function() {
          // The timeout allows the message to be displayed after the UI has
          // changed to the signed out state.
          setTimeout(function() {
            alert('Please sign in again to delete your account.');
          }, 1);
        });
      }
    });
  };

  // Initializes the FirebaseUI app.
  var initApp = function() {
    document.getElementById('sign-in-with-redirect').addEventListener('click', signInWithRedirect);
    document.getElementById('sign-out').addEventListener('click', function() {
      firebase.auth().signOut();
    });
    document.getElementById('delete-account').addEventListener('click', function() {
      deleteAccount();
    });
  };

  window.addEventListener('load', initApp);

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

  // temp login - remove after fb auth is working
  $("#temp-login").on("click", function(){
    event.preventDefault();
    user = $("#temp-login-input").val().trim();

    //show poster as clickable item in library (#list)
    console.log(user);
    saveUserSession(user);    

    $("#temp-login-input").val("");

    location.href = "index.html";
  });

});  // end of document.ready!


// display poster on info page
function displayShowPoster() {
  var show = $(this).attr("data-name");
  var queryURL = "https://www.omdbapi.com/?t=" + show + "&y=&plot=long&apikey=40e9cece";

  // Creates AJAX call for the specific show button being clicked
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {

    // Creates a div to hold the show
    $(".show-poster").empty();
    // Retrieves the poster Data
    console.log(response);
    $("#show-poster").html(response.Poster);

    // need to add functionality 
  });
}

// display show info on info page
function displayShowInfo() {
  var show = $(this).attr("data-name");
  var queryURL = "https://www.omdbapi.com/?t=" + show + "&y=&plot=long&apikey=40e9cece";

  // Creates AJAX call for the specific show button being clicked
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {

    // Creates a div to hold the show
    $(".show-info").empty();
    // Retrieves the title, year, genre, and number of seasons Data
    console.log(response);
    $("#show-info").html("<p>Title: " + response.Title + "</p>");
    $("#show-info").html("<p>Year: " + response.Year + "</p>");
    $("#show-info").html("<p>Genre: " + response.Genre + "</p");
    $("#show-info").html("<p>Number of Seasons: " + response.totalSeasons + "</p>");
  });
}

// display show plot on info page
function displayShowPlot() {
  var show = $(this).attr("data-name");
  var queryURL = "https://www.omdbapi.com/?t=" + show + "&y=&plot=long&apikey=40e9cece";

  // Creates AJAX call for the specific Show button being clicked
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {

    // Creates a div to hold the Show
    $(".show-plot").empty();
    // Retrieves the Plot Data
    console.log(response);
    $("#show-plot").html("<p>Plot: " + response.Plot + "</p>");
  });
}


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

      //push show to shows db
      var userRef = user + "/shows/";
      database.ref(userRef).push({
        showName: response.Title,
        showURL: showURL,
      });
    });
}

