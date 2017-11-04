var config = {
  apiKey: "AIzaSyAUfx2zzGieGetCyObO9plSOpAY1pEUpvo",
  authDomain: "across-the-streams.firebaseapp.com",
  databaseURL: "https://across-the-streams.firebaseio.com",
  projectId: "across-the-streams",
  storageBucket: "across-the-streams.appspot.com",
  messagingSenderId: "249811555949"
};
firebase.initializeApp(config);

var uiConfig = {
  signInSuccessUrl: 'index.html',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>'
};

var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

var listname;

var houndURL = "https://api.mediahound.com/1.2/security/oauth/authorize?response_type=token&client_id={mhclt_across-the-streams}&client_secret={qZRhyECF7qz72i5veWNqTd68wrbwepwQL71P0bJNgTTfrdaw}&scope=public_profile+user_likes&redirect_uri=http://localhost";

initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var uid = user.uid;
      var providerData = user.providerData;
      user.getIdToken().then(function(accessToken) {
        document.getElementById('sign-in-status').textContent = 'Signed in';
        document.getElementById('sign-in').textContent = 'Sign out';
        document.getElementById('account-details').textContent = JSON.stringify({
          displayName: displayName,
          email: email,
          emailVerified: emailVerified,
          photoURL: photoURL,
          uid: uid,
          accessToken: accessToken,
          providerData: providerData
        }, null, '  ');
      });
    } else {
      // User is signed out.
      document.getElementById('sign-in-status').textContent = 'Signed out';
      document.getElementById('sign-in').textContent = 'Sign in';
      document.getElementById('account-details').textContent = 'null';
    }
  }, function(error) {
    console.log(error);
  });
};

window.addEventListener('load', function() {
  initApp()
});



// submit/delete buttons  MV
$(document).ready(function(){
	$("#submit").on("click", function(){
    event.preventDefault();
    var show = [];

    function displayPoster() {

        var show = $(this).attr("list");
        var queryURL = "https://www.omdbapi.com/?t=" + show + "&y=&plot=long&apikey=40e9cece";

        // Creates AJAX call for the specific show button being clicked
        $.ajax({
          url: queryURL,
          method: "GET"
        }).done(function(response) {

          // Creates a div to hold the show
          $(".list").empty();
          // Retrieves the Rating Data
          console.log(response);
          $("#list").html(response.Poster);
 });

      }

function renderButtons() {
        // Loops through the array of movies
        for (var i = 0; i < show.length; i++) {
          // Then dynamicaly generates buttons for each movie in the array
          // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
          var a = $("<button>");
          // Adds a class of movie to our button
          a.addClass("show");
          // Added a data-attribute
          a.attr("list", show[i]);
          // Provided the initial button text
          a.text(show[i]);
          // Added the button to the buttons-view div
          $("#list").append(a);
        }
      }
	});
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


	$(document).on("click",".deleteButton", function(){
		$(this).parent().remove();

	})
	
;

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
          // Retrieves the Rating Data
          console.log(response);
          $("#show-poster").html(response.Poster);
 });

      }

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

        // Creates AJAX call for the specific show button being clicked
        $.ajax({
          url: queryURL,
          method: "GET"
        }).done(function(response) {

          // Creates a div to hold the show
          $(".show-plot").empty();
          // Retrieves the Rating Data
          console.log(response);
          $("#show-plot").html("<p>Plot: " + response.Plot + "</p>");
 });

      }