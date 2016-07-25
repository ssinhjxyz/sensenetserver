function myReservations()
{
	$(".sensenetInterface").hide();
    var emailId = $("#emailId").text();
    $("ul#myReservationsList").empty();
    $.ajax({
    type: "GET",
    url: "/myreservations?emailId=" + emailId,
    traditional: true,
    }).done(
        function(response) 
        {
        	var reservations = JSON.parse(response);
            for(var i in reservations)
        	{
        		$("ul#myReservationsList").append('<li class="list-group-item"><div class="row">' +
				'<div class="col-md-3">' + rfc339ToString(reservations[i].start.dateTime) + '</div>' +
				'<div class="col-md-3">' + rfc339ToString(reservations[i].end.dateTime) + '</div>' +
				'<div class="col-md-3">' + (reservations[i].location) + '</div>' +
                '<div class="col-md-3"><div class = "btn btn-danger" onclick=deleteReservation("' + (reservations[i].id) + '","' + (reservations[i].organizer.email) + '");>Delete</div></div>' +
				'</div></li>');
        	}
        });
}

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