function myReservations()
{
	$(".sensenetInterface").hide();
    var emailId = $("#emailId").text();
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
        							'<div class="col-md-4">' + rfc339ToString(reservations[i].start.dateTime) + '</div>' +
        							'<div class="col-md-4">' + rfc339ToString(reservations[i].end.dateTime) + '</div>' +
        							'<div class="col-md-4">' + (reservations[i].location) + '</div>' +
        							'</div></li>');
        	}
        });
}