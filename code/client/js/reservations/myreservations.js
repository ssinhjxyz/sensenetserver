function showMyReservations()
{
    $("#createReservation").hide();
    $("#myReservations").show();
    $("#myCredentials").hide();

    var emailId = $("#emailId").text();
    $(".myReservationsData").remove();
    $.ajax({
    type: "GET",
    url: "/myreservations?emailId=" + emailId,
    traditional: true,
    }).done(
        function(response) 
        {
        	var reservations = JSON.parse(response);
            reservations.sort(compareStartDate);
            for(var i in reservations)
        	{
                        		
                var html = '<li class="list-group-item myReservationsData"><div class="row">' +
				'<div class="col-md-3">' + rfc339ToString(reservations[i].start.dateTime) + '</div>' +
				'<div class="col-md-3">' + rfc339ToString(reservations[i].end.dateTime) + '</div>' +
				'<div class="col-md-3">' + (reservations[i].location) + '</div>';
                html = addDeleteButton(reservations[i], html);
				html += '</div></li>';
                $("#myReservationsList").append(html);
        	}
        });
}

function addDeleteButton(reservation, html)
{
    if(!hasEventStarted(reservation.start.dateTime))
        html += '<div class="col-md-3"><div class = "btn btn-danger" onclick=deleteReservation("' + reservation.id + '","' + reservation.organizer.email + '","' + reservation.start.dateTime +'"); >Delete</div></div>'
    else
        html += '<div class="col-md-3">Ongoing. Cannot be deleted.</div>'
    return html;
}

function hasEventStarted(startTime)
{
    var hasStarted = rfc339ToTicks(startTime) < new Date().getTime();
    return hasStarted;
}

function deleteReservation(eventId, calendarId, startTime)
{  
    if(hasEventStarted(startTime))
    {
        alert("The reservation has already started. It cannot be deleted now.")
        return;
    }

    $.ajax({
    type: "GET",
    url: "/deletereservation?eventId=" + eventId + "&calendarId=" + calendarId,
    traditional: true,
    }).done(
        function(response) 
        {
            var response = JSON.parse(response);
            if(response.status == "ok")
            {
                showMyReservations();
            }
        });
}

function compareStartDate(a,b) 
{
  if (rfc339ToTicks(a.start.dateTime) < rfc339ToTicks(b.start.dateTime))
    return -1;
 else 
    return 1;
}
