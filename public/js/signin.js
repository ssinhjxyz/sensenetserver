function signIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  $("#signout").show();
  $("#signin").hide();
  $("#emailId").text(profile.getEmail());
  $("#user").text("Welcome, " + profile.getName());
  $(".sensenetInterface").show();
  $("#signedout").hide();
}