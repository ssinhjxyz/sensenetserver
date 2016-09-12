function showCreateReservation()
{
  $("#createReservation").show();
  $("#myReservations").hide();
  $("#myCredentials").hide();
}


function reserve(event) 
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
     var uid = (new Date()).getTime() + getEmailUserName(emailId);
    
    // validate user's inputs
    var isValid = validateInputs(ids, start, end);
    
    // If the inputs are valid, call the schedule API and pass the user's inputs
    if(isValid)
    {
      upload(uid, emailId, ids, start, end, loginMethod);
      // upload the public key if the login method is rsa
      if(loginMethod === "rsa")
      {
        //upload(uid, callReserve);
      }
      else
      {
        //callReserve();
      }

    return false;
}

function callReserve()
{

    $.ajax({
    type: "POST",
    url: "/reserve",
    traditional: true,
    data: 
    {
        emailId: emailId,
        ids: ids,
        loginMethod: loginMethod, 
        startDateTime: start,
        endDateTime: end,
        uid: uid 
      }
    }).done(
        function(response) {
            var response = JSON.parse(response);
            $("#keyUploaded").hide();
            showResults(response);
        });
    }
}

function showResults(response)
{
    $("#reservationLogin").html(response.login);
    $('#reservationsCreated').hide();
    $('#reservationsFailed').hide();
    $('#invalidEvent').hide();
    $('#reservationsCreatedDetails').empty();
    $('#reservationsFailedDetails').empty();
    $("#showReservationDetails").show();
    $('#reservationResults').modal('show');
    if(!response.isValidEvent)
    {
      $('#invalidEvent').show();
      return; 
    }
    var numReserved = response.reservedBBBIDs.length;
    var numFailed = response.failedBBBIDs.length;
    if(numReserved > 0)
    {

       $('#reservationsCreated').show();
       if(response.loginMethod == "password")
       {
        $("#reservationPassword").html("<br>.Your password is " + response.password);
        $("#reservationLoginMethod").html("password");
       }
       else if(response.loginMethod == "rsa")
       {
        $("#reservationPassword").html("");
        $("#reservationLoginMethod").html("RSA key");
       }
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
           var id = response.failedBBBIDs[i].id;
           var message = response.failedBBBIDs[i].message; 
           $('#reservationsFailedDetails').append("<div> BBB " + id +
                                                    " : " + message +  "</div>");
       }  
    }
    else
    {
       $('#reservationsFailed').hide();   
    }
 
}

function validateInputs(ids, start, end){

    var isValid = true;
    if( ids.length === 0)
    {
        isValid = false;
        alert("Please enter valid BBB Ids");
    }
    else if(start === end)
    {
      isValid = false;
      alert("Please enter different start and end dates.");
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