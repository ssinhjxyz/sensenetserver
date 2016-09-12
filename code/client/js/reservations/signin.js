function signIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  emailId = profile.getEmail();
  if(validateDomain())
  {
	  $("#signout").show();
	  $("#signin").hide();
	  $("#emailId").text(emailId);
	  $("#user").text("Welcome, " + profile.getName());
	  $(".sensenetInterface").show();
	  $("#signedout").hide();
	  $("#reservationLinks").show();
	  refreshCredentialsInfo();
  }
  else
  {
  	alert("Please sign in using your ncsu email id.")
  	signOut();
  }
}
var emailId;

function validateDomain()
{
	var valid = false;
	var domain = emailId.replace(/.*@/, "");
	if(domain === "ncsu.edu")
	{
		valid = true;
	}
	return valid;
}