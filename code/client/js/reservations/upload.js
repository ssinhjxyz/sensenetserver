// Event handlers
$(function()
{
	$('#upload-btn').on('click', function (){
	    $('#upload-input').click();
	});

	$('#upload-input').on('change', function()
	{
	    //$("#keyUploaded").show();
	});
});


function upload(filename, emailId, bbbIds,start, end, loginMethod)
{
	  // sends the public key to the server
	  var formData = new FormData();
	  var files = $('#upload-input').get(0).files;
	  if (files.length === 1)
	  {
	    var file = files[0];
	    if(validateExtension())
	    {
	    	formData.append('uploads[]', file, filename);
	  	}
	  	else
	  	{
	  		alert('Please upload a file with "pub" extension');
	  		return;
	  	}
	}
	formData.append('emailId', emailId);
	formData.append('bbbIds', bbbIds);
	formData.append('end', end);
	formData.append('start', start);
	formData.append('loginMethod', loginMethod);
	formData.append('uid', filename);
	formData.append('deleteKey', document.getElementById('deleteKey').checked);
	formData.append('uploadKey', document.getElementById('uploadKey').checked)
    $.ajax(
    {
	  url: '/reserve',
	  type: 'POST',
	  data: formData,
	  processData: false,
	  contentType: false,
	  success: function(response)
	  {
	  	  response = JSON.parse(response);
	      console.log('upload successful!');
	      console.log(response);
          $("#reservationLogin").html(response.login);
          $("#reservationPassword").html(response.password);
          $("#keyUploaded").hide();
          showResults(response);
	  }
	});
}

function validateExtension()
{
	  var isValid = false;
	  var files = $('#upload-input').get(0).files;
	  if (files.length === 1)
	  {
	    var file = files[0];
	    var extension = getExtension(file.name);
	    if(extension === "pub")
	    {
	    	isValid = true;
	    }
	   }
	   return isValid;
}
