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
var uid; // = "test-user";

// firebase ref variables
var userRef;
var showRef;

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
    $("#name").empty();
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

// -------> END FIREBASE LOGIN CODE <-------
  
  // user = sessionStorage.getItem("user");

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
    //remove from html
    $(this).parent().remove();
    
    // Remove from firebase
    var tempShow = this.value.replace(/\s+/g, '');
    database.ref(userRef).child(tempShow).remove();
    
    // Remove from showNames array and decrement showCounter
    for (i = 0; i < showCounter; i++) {
      if (this.value === showNames[i]) {
        showNames.splice(i, 1);
        showCounter--;
      }
    }
  }); 

    // window load for pulling data from firebase db - uid not populated in document.ready
  $(window).on("load", function() {
    uid = firebase.auth().currentUser.uid;
    console.log(uid);

      //save user uid to session storage
    // saveUserSession(uid);

    userRef = "users/" + uid + "/shows";
    
    // get shows from db
    database.ref(userRef).on("child_added", function(snapshot) {

      console.log(database.ref(userRef));

      var showData = snapshot.val();
      console.log(showData);

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
        a.attr("href", "info.html?name="+response.Title);

        //new div for show
        var div = $("<div>");
        div.addClass("pull-left show-div");
        div.attr("value", response.Title);

        // poster for the show
        var poster = $("<img>");
        poster.attr("href", "/info.html");
        poster.addClass("thumbnail");
        poster.attr("src", response.Poster);
        poster.attr("width", "150");

        //del button 
        var deleteButton = $("<button>").addClass("btn-sm btn-danger delete-button");
        deleteButton.html("X");
        deleteButton.attr("value", response.Title);

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

        // // add href to poster/title
        // var a = $("<a>");
        // a.attr("href", "info.html");

        // //new div for show
        // var div = $("<div>");
        // div.addClass("pull-left show-div");
        // div.attr("value", response.Title);

        // // poster for the show
        // var poster = $("<img>");
        // poster.attr("href", "/info.html");
        // poster.addClass("thumbnail");
        // poster.attr("src", response.Poster);
        // poster.attr("width", "150");

        // //del button 
        // var deleteButton = $("<button>").addClass("btn-sm btn-danger delete-button");
        // deleteButton.html("X");
        // deleteButton.attr("value", response.Title);

        // //title 
        // var title = $("<h3>");
        // title.text(response.Title);

        // //append img and delete button to div
        // div.append(deleteButton);
        // div.append(a);
        // a.append(poster);
        // a.append(title);
        // $("#list").append(div);

        // add shows to array
        showNames[showCounter] = response.Title;
        showCounter++; 
      });
    });

  }); // end of window.load

});  // end of document.ready!

//save show name and apiurl to local
// function saveShowLocalInfo(apiURL, showName) {
//   localStorage.setItem("name", showName);
//   localStorage.setItem("url", apiURL);

//   console.log(localStorage);
// }

// //save user name to sessionStorage
// function saveUserSession(userName) {
//   sessionStorage.setItem("user", userName);

//   console.log(sessionStorage);
// }

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
    console.log(showCounter);

    //should we add to library
    var addToLibrary = true;

    console.log(addToLibrary);

    // loop through shows
    for (i = 0; i < showCounter; i++) {
      console.log(showNames[i]);
      console.log(response.Title);
      // check for title in showNames array
      if (showNames[i] === response.Title) {
        
        console.log("movie alread exists in library");

        // modal for already in library **FIX-ME - just dims screen
        // $("#in-lib-modal").modal("show"); 
        
        // when exists already, don't add
        addToLibrary = false;
      }
    }
    
    // add to library flag is true?... then do this   
    if (addToLibrary) {
      // // add href to poster/title
      // var a = $("<a>");
      // a.attr("href", "info.html?name="+response.Title);

      // //new div for show
      // var div = $("<div>");
      // div.addClass("pull-left show-div");
      // div.attr("value", response.Title);

      // // poster for the show
      // var poster = $("<img>");
      // poster.attr("href", "/info.html");
      // poster.addClass("thumbnail");
      // poster.attr("src", response.Poster);
      // poster.attr("width", "150");

      // //del button 
      // var deleteButton = $("<button>").addClass("btn-sm btn-danger delete-button");
      // deleteButton.html("X");
      // deleteButton.attr("value", response.Title);

      // //title 
      // var title = $("<h3>");
      // title.addClass("showLink")
      // title.text(response.Title);

      // //append img and delete button to div
      // div.append(deleteButton);
      // div.append(a);
      // a.append(poster);
      // a.append(title);
      // $("#list").append(div);

      //push show to shows db
      userRef = "users/" + uid + "/shows/";
      var showName = response.Title.replace(/\s+/g, '');
      var showRef = userRef + showName;
      var urlRef = showRef + showURL;
      
      database.ref(showRef).set({
        showName: response.Title,
        showURL: showURL,
       });

      // add the title to showName array and increment the showCounter for looping
      showNames[showCounter] = response.Title;
      showCounter++;
    } 
  });
}