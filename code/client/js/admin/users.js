function addUser()
{
	
	var data = {};
	data.emailId = $("#userEmail").val();
	$("#addUser").attr("disabled","true");
	$.ajax({
	  type: "POST",
	  url: "/adduser",
	  traditional: true,
	  data:data
	}).done(function()
	{
		$("#addUser").removeAttr("disabled");
		console.log("user added")
	});  
}

function deleteUser()
{
	var data = {};
	data.emailId = $("#userEmail").val();
	$("#deleteUser").attr("disabled","true");
	$.ajax({
	  type: "POST",
	  url: "/deleteuser",
	  traditional: true,
	  data:data
	}).done(function()
	{
		$("#deleteUser").removeAttr("disabled");
		console.log("user deleted")
	});  
}

function refreshUserInfo()
{
	
  $.ajax({
    type: "GET",
    url: "/userinfo",
    traditional: true,
    }).done(
    function(userInfo) 
    {
      $("#userInfo").empty();
      var userInfo = JSON.parse(userInfo);
      for(var i in userInfo)
      {
        $("#userInfo").append('<li class="list-group-item"><div class="row"><div class="col-md-2">' + parseInt(i+1) + '</div>' +
                    '<div class="col-md-3">' + (userInfo[i]) + '</div>' + 
                    '<div class="col-md-3"><div class = "btn btn-danger">Delete</div></div>');
      }
    });  
}

