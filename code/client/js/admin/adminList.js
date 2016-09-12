function refreshAdminList()
{
	 $.ajax({
	  type: "POST",
	  url: "/refreshadminlist",
	  traditional: true
	}).done(function()
	{
	});  
}