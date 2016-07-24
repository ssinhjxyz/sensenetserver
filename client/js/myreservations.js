function myReservations()
{
    var emailId = $("#emailId").text();
    $.ajax({
    type: "GET",
    url: "/myreservations?emailId=" + emailId,
    traditional: true,
    }).done(
        function(response) 
        {
        	var response = JSON.parse(response);
            console.log(response);
        });
}