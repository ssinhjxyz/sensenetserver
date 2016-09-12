function upload(filename, emailId, bbbIds, start, end, loginMethod, keyName)
{
	  var data = {};       
    data.emailId = emailId;
    data.bbbIds = bbbIds;
    data.start = start;
    data.end= end;
    data.loginMethod = loginMethod;
    data.uid = filename;
    data.keyName = keyName;

    $.ajax({
      type: "POST",
      url: "/reserve",
      traditional: true,
      data:data
    }).done(function(response){
    	  response = JSON.parse(response);
          console.log('upload successful!');
          console.log(response);
          $("#reservationLogin").html(response.login);
          $("#reservationPassword").html(response.password);
          $("#keyUploaded").hide();
          showResults(response);
    });
}

