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

function updatePassword()
{
    var newPassword = $("#newPassword").val();
    var data = {};
    data.newPassword = newPassword;
    data.emailId = emailId;
    $.ajax({
      type: "POST",
      url: "/updateuserpassword",
      traditional: true,
      data:data
    }).done(function()
    {
        getPassword();
    });  
}