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


function upload(filename)
{
	  // sends the public key to the server
	  var files = $('#upload-input').get(0).files;
	  if (files.length === 1)
	  {
	    var formData = new FormData();
	    var file = files[0];
	    if(validateExtension())
	    {
		    formData.append('uploads[]', file, filename);
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
			  }
			});
	  	}
	  	else
	  	{
	  		alert('Please upload a file with "pub" extension');
	  	}
	}
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