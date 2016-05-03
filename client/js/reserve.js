function handleScheduleClick(event) 
{
    event.preventDefault();
    $("#reservationDetails").hide();
    
    // Get the user's inputs
    var emailId = $("#emailId").text();
    var bbbIds = $("#bbbId").val();
    var ids = parseBBBIds(bbbIds);
    var end = $('#endDateTime').data("DateTimePicker").date().utc().format();
    var start = $('#startDateTime').data("DateTimePicker").date().utc().format();
    var loginMethod = $('#pwdlogin').hasClass("active") ? "password":"rsa";
    
    // validate user's inputs
    var isValid = validateInputs(ids);

    // If the inputs are valid, call the schedule API and pass the user's inputs
    if(isValid)
    {
        $.ajax({
        type: "POST",
        url: "/schedule",
        traditional: true,
        data: {
            emailId: emailId,
            ids: ids,
            loginMethod: loginMethod, 
            startDateTime: start,
            endDateTime: end }
        }).done(
            function(response) {
                var response = JSON.parse(response);
                console.log(response);
                $("#reservationLogin").html(response.login);
                $("#reservationPassword").html(response.password);
                $("#keyUploaded").hide();
                showResults(response);
            });
      }

    return false;
}

function showResults(response)
{
    $("#showReservationDetails").show();
    $('#reservationResults').modal('show');
    $('#reservationsCreatedDetails').empty();
    $('#reservationsFailedDetails').empty();
    var numReserved = response.reservedBBBIDs.length;
    var numFailed = response.failedBBBIDs.length;
    if(numReserved > 0)
    {
       $('#reservationsCreated').show();
       for(var i = 0; i < numReserved; i++)
       {
           $('#reservationsCreatedDetails').append("<div>BBB " + response.reservedBBBIDs[i] +
                                                    " : " + response.reservedBBBIPs[i] + "</div>");
       }
    }
    else
    {
       $('#reservationsCreated').hide();   
    }
    if(numFailed > 0)
    { 
       $('#reservationsFailed').show();
       for(var i = 0; i < numFailed; i++)
       {
           $('#reservationsFailedDetails').append("<div> BBB " + response.failedBBBIDs[i] +
                                                    " : Device does not exist. </div>");
       }  
    }
    else
    {
       $('#reservationsFailed').hide();   
    }
 
}

function validateInputs(ids){

    var isValid = true;
    if( ids.length === 0)
    {
        isValid = false;
        alert("Please enter valid BBB Ids");
    }
    return isValid;
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
      
      if( id === "")
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