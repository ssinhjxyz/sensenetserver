$(function()
{
  $("#configureBBB").click(
  function()
  {
    var data = {};
    data.bbbIP = $("#bbbIP").val();
    data.bbbPort = $("#bbbPort").val();
    data.bbbID = $("#bbbID").val();
    console.log(data);
  });

	$.ajax({
      type: "GET",
      url: "/bbbinfo",
      traditional: true,
      }).done(
          function(bbbInfo) 
          {
              var bbbInfo = JSON.parse(bbbInfo).info;
              for(var i in bbbInfo)
              {
              	$("ul#bbbInfo").append('<li class="list-group-item"><div class="row"><div class="col-md-2">' + i + '</div>' +
              							'<div class="col-md-4">' + (bbbInfo[i].IP) + '</div>' + 
              							'<div class="col-md-3">' + bbbInfo[i].Reachability + '</div>' +
              							'<div class="col-md-3">' + bbbInfo[i].Configured + '</div></div></li>');
              }
          });
/*
      $.ajax({
      type: "POST",
      url: "/addbbb",
      traditional: true,
      data: 
      {
          bbbIP:"152.14.102.251",
          bbbPort:"51003"
      }
      });*/
});
