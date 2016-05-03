function signIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  var emailId = profile.getEmail();
  if(validateDomain(emailId))
  {
	  $("#signout").show();
	  $("#signin").hide();
	  $("#emailId").text(emailId);
	  $("#user").text("Welcome, " + profile.getName());
	  $(".sensenetInterface").show();
	  $("#signedout").hide();
  }
  else
  {
  	alert("Please sign in using your ncsu email id.")
  	signOut();
  }
}

function validateDomain(emailId)
{
	var valid = false;
	var domain = emailId.replace(/.*@/, "");
	if(domain === "ncsu.edu")
	{
		valid = true;
	}
	return valid;
}