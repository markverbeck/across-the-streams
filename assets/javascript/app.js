var config = {
  apiKey: "AIzaSyAUfx2zzGieGetCyObO9plSOpAY1pEUpvo",
  authDomain: "across-the-streams.firebaseapp.com",
  databaseURL: "https://across-the-streams.firebaseio.com",
  projectId: "across-the-streams",
  storageBucket: "across-the-streams.appspot.com",
  messagingSenderId: "249811555949"
};
firebase.initializeApp(config);

var listname;

var houndURL = "https://api.mediahound.com/1.2/security/oauth/authorize?response_type=token&client_id={mhclt_across-the-streams}&client_secret={qZRhyECF7qz72i5veWNqTd68wrbwepwQL71P0bJNgTTfrdaw}&scope=public_profile+user_likes&redirect_uri=http://localhost";

// submit/delete buttons  MV
$(document).ready(function(){
  //
	$("#submit").on("click", function(){
		event.preventDefault();
    var buttonName = [];
		listname = $("#listItem").val().trim();
  //   buttonName.push(listname);
		// var button = $("<button>").addClass("btn-lg btn-default listSearch");
		// button.attr("data-title", listname);
		// button.html(listname);
		// var deleteButton = $("<button>").addClass("btn-sm btn-danger deleteButton");
		// deleteButton.html("X");
		// deleteButton.attr("data-title", listname);
		// var div = $("<div>");
		// div.addClass("pull-left buttonDiv");
		// div.attr("data-title", listname);
		// div.append(deleteButton);
		// div.append(button);
		// $("#list").append(div);
		// $("#listItem").val("");

    //show poster as clickable item in library (#list)
    console.log(listname);
    populateShows(listname);
	});

  //
	$(document).on("click",".deleteButton", function(){
		$(this).parent().remove();
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
});  // end of document.ready!


//
function displayShowPoster() {
  var show = $(this).attr("data-name");
  var queryURL = "https://www.omdbapi.com/?t=" + show + "&y=&plot=long&apikey=40e9cece";

  // Creates AJAX call for the specific movie button being clicked
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {

    // Creates a div to hold the movie
    $(".show-poster").empty();
    // Retrieves the Rating Data
    console.log(response);
    $("#show-poster").html(response.Poster);

    // need to add functionality 
  });
}

function displayShowInfo() {
  var show = $(this).attr("data-name");
  var queryURL = "https://www.omdbapi.com/?t=" + show + "&y=&plot=long&apikey=40e9cece";

  // Creates AJAX call for the specific movie button being clicked
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {

    // Creates a div to hold the movie
    $(".show-info").empty();
    // Retrieves the Rating Data
    console.log(response);
    $("#show-info").html("<p>Title: " + response.Title + "</p>");
    $("#show-info").html("<p>Year: " + response.Year + "</p>");
    $("#show-info").html("<p>Genre: " + response.Genre + "</p");
    $("#show-info").html("<p>Number of Seasons: " + response.totalSeasons + "</p>");
  });
}

function displayShowPlot() {
  var show = $(this).attr("data-name");
  var queryURL = "https://www.omdbapi.com/?t=" + show + "&y=&plot=long&apikey=40e9cece";

  // Creates AJAX call for the specific movie button being clicked
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {

    // Creates a div to hold the movie
    $(".show-plot").empty();
    // Retrieves the Rating Data
    console.log(response);
    $("#show-plot").html("<p>Plot: " + response.Plot + "</p>");
  });
}


//save show name and apiurl to local
function saveShowLocalStor(apiURL, showName) {
  localStorage["name"] = showName;
  localStorage["url"] = apiURL;
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

      // add a
      var a = $("<a>");
      a.attr("href", "../../info.html");

      //new div for show
      var div = $("<div>");
      $("#list").append(div);
      div.addClass("pull-left show-div");
      div.attr("data-show", response.Title);
      div.attr()

      // poster for the show
      var poster = $("<img>");
      poster.addClass("thumbnail");
      poster.attr("src", response.Poster);

      //del button to show div
      var deleteButton = $("<button>").addClass("btn-sm btn-danger delete-button");
      deleteButton.html("X");
      deleteButton.attr("data-show", response.Title);

      var title = $("<h2>");
      title.html(response.Title);

      //append img and delete button to div
      a.append(div);
      div.append(deleteButton);
      div.append(poster);
      div.append()

      // buttonName.push(listname);
      // var button = $("<button>").addClass("btn-lg btn-default listSearch");
      // button.attr("data-title", listname);
      // button.html(listname);
      // var div = $("<div>");
      // div.addClass("pull-left buttonDiv");
      // div.attr("data-title", listname);
      // div.append(deleteButton);
      // div.append(button);
      // // $("#list").append(div);
      // // $("#listItem").val("");

      console.log(response.Poster);
      console.log(response.Title);
    });
}

