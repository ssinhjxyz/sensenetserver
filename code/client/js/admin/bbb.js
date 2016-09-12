function configureBBB()
{
    var data = {};
    data.bbbIP = $("#bbbIP").val();
    data.bbbPort = $("#bbbPort").val();
    data.bbbID = $("#bbbID").val();
    data.bbbCalendarId = $("#bbbCalendarId").val();
    $.ajax({
      type: "POST",
      url: "/configurebbb",
      traditional: true,
      data:data
    });
}

function refreshBBBInfo()
{
  $.ajax({
    type: "GET",
    url: "/bbbinfo",
    traditional: true,
    }).done(
    function(bbbInfo) 
    {
      $("#bbbInfo").empty();
      var bbbInfo = JSON.parse(bbbInfo).info;
      for(var i in bbbInfo)
      {
        $("#bbbInfo").append('<li class="list-group-item"><div class="row"><div class="col-md-2">' + i + '</div>' +
                    '<div class="col-md-4" data-property="IP" data-id="' + i + '" contenteditable="true" >' + (bbbInfo[i].IP) + '</div>' + 
                    '<div class="col-md-3" data-id="' + i + '" >' + bbbInfo[i].Reachability + '</div>' +
                    '<div class="col-md-3" data-property="Configured" data-id="' + i + '" contenteditable="true">' + bbbInfo[i].Configured + '</div></div></li>');
      }
    });
}