$(function()
{
  authorize();
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
  });

  $("#usersLink").click(function(event){
    $("#bbbSection").hide();
    $("#usersSection").show();
  });
  // Fetch and display BBB configurations on page load
  refreshBBBInfo();
  refreshUserInfo();
  $("#usersSection").hide();
});
