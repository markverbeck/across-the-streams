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
var uid = null;

var houndURL = "https://api.mediahound.com/1.2/security/oauth/authorize?response_type=token&client_id={mhclt_across-the-streams}&client_secret={qZRhyECF7qz72i5veWNqTd68wrbwepwQL71P0bJNgTTfrdaw}&scope=public_profile+user_likes&redirect_uri=http://localhost";

// submit/delete buttons  MV
$(document).ready(function(){
  //
	$("#submit").on("click", function(){
		event.preventDefault();
    var buttonName = [];
		listname = $("#listItem").val().trim();
    buttonName.push(listname);
		var button = $("<button>").addClass("btn-lg btn-default listSearch");
		button.attr("data-title", listname);
		button.html(listname);
		var deleteButton = $("<button>").addClass("btn-sm btn-danger deleteButton");
		deleteButton.html("X");
		deleteButton.attr("data-title", listname);
		var div = $("<div>");
		div.addClass("pull-left buttonDiv");
		div.attr("data-title", listname);
		div.append(deleteButton);
		div.append(button);
		$("#list").append(div);
		$("#listItem").val("");
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
    
    console.log(this.data-show);

    $(this).parent().remove();

    //remove from db
    database.ref(this.value).remove();
  }); 

  // temp login - remove after fb auth is working
  $("#temp-login").on("click", function(){
    event.preventDefault();
    user = $("#temp-login-input").val().trim();

    //show poster as clickable item in library (#list)
    console.log(user);
    saveUserSession(user);
  }); 

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
