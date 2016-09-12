$(function()
{
  $("#refreshInfo").click(
    function()
    {
      refreshInfo();
    });

  $("#configureBBB").click(
  function()
  {
     configureBBB();
  });

  $('#bbbInfo').keyup(function(e)
  {
    addToChangedConfigs(e.target)
  });

  $('#updateBBBYes').click(function()
  {
    sendBBBConfigToServer();
  });
  
  $('#addUser').click(function()
  {
    addUser();
  });
  
  $('#deleteUser').click(function()
  {
    deleteUser();
  });
  
  $("#bbbLink").click(function(event){
    $("#usersSection").hide();
    $("#bbbSection").show();
    $("#adminsSection").hide();
  });

  $("#usersLink").click(function(event){
    $("#bbbSection").hide();
    $("#usersSection").show();
    $("#adminsSection").hide();
  });

  $("#adminsSubLink").click(function(event){
    $("#bbbSection").hide();
    $("#usersSection").hide();
    $("#adminsSection").show();
  });

  $("#refreshAdminList").click(function(event){
    refreshAdminList();
  });

  // Fetch and display BBB configurations on page load
  refreshBBBInfo();
  refreshUserInfo();
  $("#usersSection").hide();
});
