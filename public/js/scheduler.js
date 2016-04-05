function handleScheduleClick(event) {
    event.preventDefault();
    $("#reservationDetails").hide();
    var emailId = $("#emailId").text();
    var bbbIds = $("#bbbId").val();
    var ids = parseBBBIds(bbbIds);
    var end = $('#endDateTime').data("DateTimePicker").date().utc().format();
    var start = $('#startDateTime').data("DateTimePicker").date().utc().format();

    $.ajax({
    type: "POST",
    url: "/schedule",
    traditional: true,
    data: {
        emailId: emailId,
        ids: ids,
        startDateTime: start,
        endDateTime: end }
    }).done(
        function(response) {
            var response = JSON.parse(response);
            console.log(response);
            $("#reservationLogin").html(response.login);
            $("#reservationPassword").html(response.password);
            $("#reservationDetails").show();
        }
    );
    return false;
}

function refreshCalendars() {
    var bbb1Cal = document.getElementById('BBB1Calendar');
    if (bbb1Cal)
        bbb1Cal.src = bbb1Cal.src;
}

function parseBBBIds(userinput) {
    var valid = userinput.match("^([0-9,-]+ ?)*$");
    if(!valid)
      return;
    var splitIds = userinput.split(",");
    var ids = [];
    var numIds = splitIds.length; 
    for (var i = 0; i < numIds; i++)
    {
      var id = splitIds[i];
      
      if( id.indexOf(".") !== -1)
        continue;

      if(id.indexOf('-') === -1)
      {
        var idAsInt = parseInt(id);
        ids.push(idAsInt);
      }
      else
      {
         var range = getRange(id);
         $.merge(ids,range);       
      }
    };
    return ids;
}

function getRange(rangeStr) {
    
    var range = [];
    var splitIds = rangeStr.split("-");
    if (2 === splitIds.length) 
    {
        start = parseInt(splitIds[0]);
        end = parseInt(splitIds[1]);
        for(var i = start; i <= end; i++)
        {
          range.push(i);
        }
    }
    return range;
}