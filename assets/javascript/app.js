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
var showNames = []; 
var showCounter = 0;
var user;
var uid // = "test-user";

//network counters
// var netflix = 0;
// var hulu = 0;
// var amazon = 0;
// var cbs = 0;
// var nbc = 0;
// var abc = 0;
// var fox = 0;
// var cw = 0;

var netImage;
var imageLink;

var streamService = [
    { count: '0', svc: 'hulu', src: 'assets/images/hulu.png', href: 'https://www.hulu.com/welcome'},
    { count: '0', svc: 'netflix', src: 'assets/images/netflix.png', href: 'https://www.netflix.com/' },
    { count: '0', svc: 'amazon', src: 'assets/images/Amazon.png', href: 'https://www.amazon.com/Prime-Video/b?node=2676882011' },
    { count: '0', svc: 'fox', src: 'assets/images/fox.png', href: 'http://www.fox.com/' },
    { count: '0', svc: 'abc', src: 'assets/images/abc.png', href: 'http://abc.go.com/' },
    { count: '0', svc: 'cbs', src: 'assets/images/cbs.png', href: 'http://www.cbs.com/' },
    { count: '0', svc: 'nbc', src: 'assets/images/nbc.png', href: 'http://www.nbc.com/' },
    { count: '0', svc: 'cw', src: 'assets/images/cw.png', href: 'http://www.cwtv.com/' },
];

// firebase ref variables
var userRef;
var showRef;

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

  // // submit button
  $("#submit").on("click", function(){
    event.preventDefault();
    listName = $("#listItem").val().trim();

    //show poster as clickable item in library (#list)
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

  // timeout for firebause auth info to get back to us
  setTimeout(function() {
    userRef = "users/" + uid + "/shows";

    uid = firebase.auth().currentUser.uid;
    
    // get shows from db
    database.ref(userRef).on("child_added", function(snapshot) {

      var showData = snapshot.val();
      var currentURL = showData.showURL;

      $.ajax({
      url: currentURL,
      method: "GET"
      }).done(function(response) {

        // add href to poster/title
        var a = $("<a>");
        a.attr("href", "info.html?name="+response.Title);

        //new div for show
        var div = $("<div>");
        div.addClass("col-md-2 pull-left show-div");
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

        // add shows to array
        showNames[showCounter] = response.Title;
        showCounter++; 

        // call network and web services code
        networkCall(response.Title);
        webChannelCall(response.Title);
        pickStreamer();

      }); // end ajax
    }); // end child added function

  }, 2000); // end timeout

});  // end of document.ready!

// populate show searched in list ID after search
function populateShows(show) {
  var showURL = "https://www.omdbapi.com/?t=" + show + "&y=&plot=long&apikey=40e9cece";

  $.ajax({
    url: showURL,
    method: "GET"
  }).done(function(response) {

    //should we add to library
    var addToLibrary = true;

    // loop through shows
    for (i = 0; i < showCounter; i++) {
      // check for title in showNames array
      if (showNames[i] === response.Title) {
        
        console.log("movie alread exists in library");

        // modal for already in library **FIX-ME - just dims screen
        $("#in-lib-modal").modal("show"); 
        
        // when exists already, don't add
        addToLibrary = false;
      }
    }
    
    // add to library flag is true?... then do this   
    if (addToLibrary) {

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

var networkCall = function(title){
  var api = "https://api.tvmaze.com/singlesearch/shows?q=" + title;

  $.ajax({
    url: api,
    method: "GET"
  }).done(function(response){
     
    if(response.network.name === "CBS") {
      for (i = 0; i < streamService.length; i ++) {
        if (streamService[i].svc === "cbs") {
          streamService[i].count++;
        }
      }
    }
    if(response.network.name === "NBC") {
      for (i = 0; i < streamService.length; i ++) {
        if (streamService[i].svc === "nbc") {
          streamService[i].count++;
        }
      }
    }
    if(response.network.name === "ABC") {
      for (i = 0; i < streamService.length; i ++) {
        if (streamService[i].svc === "abc") {
          streamService[i].count++;
        }
      }
    }
    if(response.network.name === "Fox") {
      for (i = 0; i < streamService.length; i ++) {
        if (streamService[i].svc === "fox") {
          streamService[i].count++;
        }
      }
    }
    if(response.network.name === "The CW") {
      for (i = 0; i < streamService.length; i ++) {
        if (streamService[i].svc === "cw") {
          streamService[i].count++;
        }
      }
    }
    // }else if (response.network.name === "NBC"){
    //   nbc++;
    // }else if (response.network.name === "ABC"){
    //   abc++;
    // }else if (response.network.name === "FOX"){
    //   fox++;
    // }else if (response.network.name === "The CW"){
    //   cw++;
    // }
    
    console.log(response.network.name);
    console.log(streamService);
  });
}

var webChannelCall = function(title){
  var api = "https://api.tvmaze.com/singlesearch/shows?q=" + title;
  $.ajax({
    url: api,
    method: "GET"
  }).done(function(response){
     
    if(response.webChannel.name === "Netflix") {
      for (i = 0; i < streamService.length; i ++) {
        if (streamService[i].svc === "netflix") {
          streamService[i].count++;
        }
      }
    }
    if(response.webChannel.name === "Hulu") {
      for (i = 0; i < streamService.length; i ++) {
        if (streamService[i].svc === "hulu") {
          streamService[i].count++;
        }
      }
    }
    if(response.webChannel.name === "Amazon Prime") {
      for (i = 0; i < streamService.length; i ++) {
        if (streamService[i].svc === "amazon") {
          streamService[i].count++;
        }
      }
    }

    // if(response.webChannel.name === "Netflix"){
    //   netflix++;
    // }else if (response.webChannel.name === "Hulu"){
    //   hulu++;
    // }else if (response.webChannel.name === "Amazon Prime"){
    //   amazon++;
    // }

    console.log(response.webChannel.name);
    console.log(streamService);
  });
}

var pickStreamer = function(){

  //sort the streamServie array
  streamService.sort(function (x, y) {
    var n = y.count - x.count;
    if (n != 0) {
        return n;
    }

    return y.svc - x.svc;
    return y.src - x.src;
    return y.href - x.href;
  });

  console.log(streamService);

  // populate the top 3 streamers in recommendedServices div
  for (i = 0; i < 3; i++) {
    netImage = $("<img>");
    netImage.addClass("serviceImage");
    netImage.attr("src", streamService[i].src);
    netImage.attr("width", "200");

    imageLink = $("<a>");
    imageLink.attr("href", streamService[i].href);
    imageLink.attr("target", "_blank");
    imageLink.append(netImage);

    $("#recommendedServices").html(imageLink);
  }

  // if(fox === 2){
  //   netImage = $("<img>");
  //   netImage.addClass("serviceImage");
  //   netImage.attr("src", "assets/images/fox.png");
  //   imageLink = $("<a>");
  //   imageLink.attr("href", "https://www.fox.com/");
  //   imageLink.attr("target", "_blank");
  //   imageLink.append(netImage);
  //   $("#recommendedServices").append(imageLink);
  // }else if (cbs === 2){
  //   netImage = $("<img>");
  //   netImage.addClass("serviceImage");
  //   netImage.attr("src", "assets/images/cbs.png");
  //   imageLink = $("<a>");
  //   imageLink.attr("href", "http://www.cbs.com/");
  //   imageLink.attr("target", "_blank");
  //   imageLink.append(netImage);
  //   $("#recommendedServices").append(imageLink);
  // }else if (nbc === 2){
  //   netImage = $("<img>");
  //   netImage.addClass("serviceImage");
  //   netImage.attr("src", "assets/images/nbc.png");
  //   imageLink = $("<a>");
  //   imageLink.attr("href", "https://www.nbc.com/");
  //   imageLink.attr("target", "_blank");
  //   imageLink.append(netImage);
  //   $("#recommendedServices").append(imageLink);
  // }else if (cw === 2){
  //   netImage = $("<img>");
  //   netImage.addClass("serviceImage");
  //   netImage.attr("src", "assets/images/cw.png");
  //   imageLink = $("<a>");
  //   imageLink.attr("href", "http://www.cwtv.com/");
  //   imageLink.attr("target", "_blank");
  //   imageLink.append(netImage);
  //   $("#recommendedServices").append(imageLink);
  // }else if (abc === 2){
  //   netImage = $("<img>");
  //   netImage.addClass("serviceImage");
  //   netImage.attr("src", "assets/images/abc.png");
  //   imageLink = $("<a>");
  //   imageLink.attr("href", "http://abc.go.com/");
  //   imageLink.attr("target", "_blank");
  //   imageLink.append(netImage);
  //   $("#recommendedServices").append(imageLink);
  // }else if (netflix === 2){
  //   netImage = $("<img>");
  //   netImage.addClass("serviceImage");
  //   netImage.attr("src", "assets/images/netflix.png");
  //   imageLink = $("<a>");
  //   imageLink.attr("href", "https://www.netflix.com/");
  //   imageLink.attr("target", "_blank");
  //   imageLink.append(netImage);
  //   $("#recommendedServices").append(imageLink);
  // }else if (hulu === 2){
  //   netImage = $("<img>");
  //   netImage.addClass("serviceImage");
  //   netImage.attr("src", "assets/images/hulu.png");
  //   imageLink = $("<a>");
  //   imageLink.attr("href", "https://www.hulu.com/welcome?orig_referrer=https%3A%2F%2Fwww.google.com%2F");
  //   imageLink.attr("target", "_blank");
  //   imageLink.append(netImage);
  //   $("#recommendedServices").append(imageLink);
  // }else if (amazon === 2){
  //   netImage = $("<img>");
  //   netImage.addClass("serviceImage");
  //   netImage.attr("src", "assets/images/Amazon.png");
  //   imageLink = $("<a>");
  //   imageLink.attr("href", "https://www.amazon.com/gp/video/offers/ref=dvm_us_dl_sl_go_brw%7Cc_163705074697_m_PfLbcut2-dc_s__?ie=UTF8&gclid=EAIaIQobChMI55DphKey1wIVyIR-Ch2wogqkEAAYASAAEgIyQPD_BwE");
  //   imageLink.attr("target", "_blank");
  //   imageLink.append(netImage);
  //   $("#recommendedServices").append(imageLink);
  
}