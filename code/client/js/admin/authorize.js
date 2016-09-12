function authorize()
{
	var data = {};
	var emailId = sessionStorage.getItem("sensenetServerEmailId");
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
          }
          else
          {
          	alert("You are not authorized to view the admin page.")
          }
    });

}