function showMyCredentials()
{
	$("#createReservation").hide();
    $("#myReservations").hide();
    $("#myCredentials").show();
}

var credentials = {};

function refreshCredentialsInfo()
{
    $.ajax({
    type: "GET",
    url: "/usercredentials?emailId=" + emailId,
    traditional: true,
    }).done(
        function(credentials) 
        {
            credentials = JSON.parse(credentials);
            $("#myPassword").html(credentials.password);
            $("select#keyList").empty();
            $("#myKeys").empty();
            for(var i in credentials.keys)
            {
                $("select#keyList").append('<option>' + credentials.keys[i].name + '</option>');
                var srNum = parseInt(i)+1;
                $("#myKeys").append('<li class="list-group-item"><div class="row"><div class="col-md-4">' + srNum + '</div>' +
                '<div class="col-md-4">' + credentials.keys[i].name + '</div>' + 
                '<div class="col-md-4">' + "To Do" + '</div>' +
                '</div></li>');
            }
             $('#keyList').selectpicker('refresh');
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
        refreshCredentialsInfo();
    });  
}

function addKey(event)
{
  event.preventDefault();
  // Create a unique id to identify the reservation.
  // This is used to uniquely name the public key, so that it is not overwritten at the server.
  var uid = (new Date()).getTime() + getEmailUserName(emailId);
  var keyname = $("#keyName").val();

  // sends the public key to the server
  var formData = new FormData();
  var files = $('#upload-input').get(0).files;
  if (files.length === 1)
  {
        var file = files[0];
        if(validateExtension())
        {
            formData.append('uploads[]', file, uid);
        }
        else
        {
            alert('Please upload a file with "pub" extension');
            return;
        }
  }

 formData.append('emailId', emailId);
 formData.append('name', keyname);
 $.ajax(
 {
      url: '/addkey',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(response)
      {
         console.log(response);   
         refreshCredentialsInfo();
      }
 });

 return false;
}
