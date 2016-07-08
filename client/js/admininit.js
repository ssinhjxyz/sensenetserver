$(function()
{
	$.ajax({
      type: "GET",
      url: "/bbbinfo",
      traditional: true,
      }).done(
          function(bbbInfo) 
          {
              var bbbInfo = JSON.parse(bbbInfo).info;
              var numBBBs = bbbInfo.length;
              for(var i = 0; i < numBBBs; i++)
              {
              	$("ul#bbbInfo").append('<li class="list-group-item"><div class="row"><div class="col-md-2">' + i + '</div>' +
              							'<div class="col-md-4">' + (bbbInfo[i].IP + 1) + '</div>' + 
              							'<div class="col-md-3">' + bbbInfo[i].Reachability + '</div>' +
              							'<div class="col-md-3">' + bbbInfo[i].Configured + '</div></div></li>');
              }
          });


      $.ajax({
      type: "POST",
      url: "/addbbb",
      traditional: true,
      data: 
      {
          bbbIP:"152.14.102.251",
          bbbPort:"51003"
      }
      });
});
