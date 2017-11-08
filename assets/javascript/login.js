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
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  var currentUser = null;
  var uid;

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
    uid = user.uid;
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

	var initApp = function() {
    document.getElementById('sign-in-with-redirect').addEventListener('click', signInWithRedirect);
    document.getElementById('sign-out').addEventListener('click', function() {
      firebase.auth().signOut();
    });
    if (currentUser != null) {
      handleSignedInUser(currentUser);
    }
  };

  window.addEventListener('load', initApp);
});