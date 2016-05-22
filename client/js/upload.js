// Event handlers
$(function(){
	$('#upload-btn').on('click', function (){
	    $('#upload-input').click();
	});

	$('#upload-input').on('change', function()
	{
	    $("#keyUploaded").show();
		$("#reserve").prop("disabled",false);
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
    $.ajax(
    {
	  url: '/upload',
	  type: 'POST',
	  data: formData,
	  processData: false,
	  contentType: false,
	  success: function(data)
	  {
	      console.log('upload successful!');
	      //callback();
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
