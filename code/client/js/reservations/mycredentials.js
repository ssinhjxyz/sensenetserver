function showMyCredentials()
{
	$("#createReservation").hide();
    $("#myReservations").hide();
    $("#myCredentials").show();
}

function getPassword()
{
    $.ajax({
    type: "GET",
    url: "/userpassword?emailId=" + emailId,
    traditional: true,
    }).done(
        function(response) 
        {
            var password = JSON.parse(response);
            $("#myPassword").html(password);
        });
}
