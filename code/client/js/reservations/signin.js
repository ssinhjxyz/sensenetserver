function signIn(googleUser) 
{
  var profile = googleUser.getBasicProfile();
  emailId = profile.getEmail();  
  authenticate(emailId, function()
  {
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
  });
  
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

function authenticate(emailId, callback)
{
	var data = {};       
    data.emailId = emailId;
  
    $.ajax({
      type: "POST",
      url: "/authenticate",
      traditional: true,
      data:data
    }).done(function(response)
    {
    	var response = JSON.parse(response);
    	if(response.valid)
    	{
    		callback();
    	}
    	else
    	{
    		alert("You are not authorized to use the reservation service. Please contact the admins.");
    	}
    });

}