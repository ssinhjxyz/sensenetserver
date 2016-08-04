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


  $('#updateBBBConfig').click(function()
  {
    sendBBBConfigToServer();
  });
  
  
  // Fetch and display BBB configurations on page load
  refreshInfo();
});
