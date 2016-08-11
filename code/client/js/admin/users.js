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
