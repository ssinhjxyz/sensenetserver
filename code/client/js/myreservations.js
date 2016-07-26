function myReservations()
{
	$("#createReservation").hide();
    $("#myReservations").show();
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
                console.log(rfc339ToTicks(reservations[i].start.dateTime));
        		$("#myReservationsList").append('<li class="list-group-item myReservationsData"><div class="row">' +
				'<div class="col-md-3">' + rfc339ToString(reservations[i].start.dateTime) + '</div>' +
				'<div class="col-md-3">' + rfc339ToString(reservations[i].end.dateTime) + '</div>' +
				'<div class="col-md-3">' + (reservations[i].location) + '</div>' +
                '<div class="col-md-3"><div class = "btn btn-danger" onclick=deleteReservation("' + (reservations[i].id) + '","' + (reservations[i].organizer.email) + '");>Delete</div></div>' +
				'</div></li>');
        	}
        });
}
0
function deleteReservation(eventId, calendarId)
{
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
                myReservations();
            }
        });
}

function compareStartDate(a,b) {
  if (rfc339ToTicks(a.start.dateTime) < rfc339ToTicks(b.start.dateTime))
    return -1;
 else 
    return 1;
}
