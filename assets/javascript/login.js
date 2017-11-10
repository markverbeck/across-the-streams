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
    currentUser = user;
    $("#user-signed-in").removeClass();
    $("#user-signed-in").addClass("show");
    $("#user-signed-out").removeClass();
    $("#user-signed-out").addClass("hidden");
    $("#name").text(user.displayName);
    uid = user.uid;
    showAccountInfo(user);
  };

  // Displays the UI for a signed out user.
  var handleSignedOutUser = function() {
    $("#account").removeClass();
    $("#account").addClass("hidden");
    $("#login-div").removeClass();
    $("#login-div").addClass("show");
    $("#account-info").empty();
    $("#user-signed-in").removeClass();
    $("#user-signed-in").addClass("hidden");
    $("#user-signed-out").removeClass();
    $("#user-signed-out").addClass("show");
  };

  // Deletes user account. This also should destroy data added by that user in Firebase.
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
    currentUser === null;
  };

  function showAccountInfo (user) {
    $("#account").removeClass();
    $("#account").addClass("show");
    $("#login-div").removeClass();
    $("#login-div").addClass("hidden");
    var div = $("<div>");
    var name = $("<p>");
    name.html("<span class='strong'>User Name: </span>" + user.displayName);
    div.append(name);
    var email = $("<p>");
    email.html("<span class='strong'>Account Email: </span>" + user.email);
    div.append(email);
    var provider = $("<p>");
    provider.html("<span class='strong'>Login Provider: </span>" + user.providerId);
    div.append(provider);
    $("#account-info").append(div);
  }

  // Listen to change in auth state so it displays the correct UI for when
  // the user is signed in or not.
  firebase.auth().onAuthStateChanged(function(user) {
    $("#loading").removeClass();
    $("#loading").addClass("hidden");
    $("#loaded").removeClass();
    $("#loaded").addClass("show");
    user ? handleSignedInUser(user) : handleSignedOutUser();
  });

  // This function contains the event listeners and calls necessary functions
	var initApp = function() {
    document.getElementById('sign-in-with-redirect').addEventListener('click', signInWithRedirect);
    document.getElementById('sign-out').addEventListener('click', function() {
      firebase.auth().signOut();
    });
    document.getElementById('delete-account').addEventListener('click', function() {
        deleteAccount();
    });
    if (currentUser === null) {
      handleSignedOutUser();
    }
  };

  window.addEventListener('load', initApp);
});