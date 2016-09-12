function authorize(emailId)
{
	var data = {};
	data.emailId = emailId;
    $.ajax({
      type: "POST",
      url: "/authorizeadmin",
      traditional: true,
      data:data
    }).done(function(response)
    {
    	  response = JSON.parse(response);
          if(response.authorized)
          {
          	$("#adminContent").show();
            $("#signout").show();
            $("#signin").hide();
            $("#emailId").text(emailId);
            $("#user").text("Welcome, " + profile.getName());
          }
          else
          {
          	alert("You are not authorized to view the admin page.")
          }
    });

}