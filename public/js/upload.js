$(function(){
	$('#upload-btn').on('click', function (){
	    $('#upload-input').click();
	});

	$('#upload-input').on('change', function()
	{

	  var files = $(this).get(0).files;
	  if (files.length === 1){
	    // One file selected, process the file upload
	    // create a FormData object which will be sent as the data payload in the
	    // AJAX request
	    var formData = new FormData();
	    var file = files[0];
	    var extension = getExtension(file.name);
	    if(extension !== "pub")
	    {
	    	alert('Please upload a file with "pub" extension');
	    }
	    else
	    {
		    formData.append('uploads[]', file, file.name);
		    $.ajax(
		    {
			  url: '/upload',
			  type: 'POST',
			  data: formData,
			  processData: false,
			  contentType: false,
			  success: function(data){
			      console.log('upload successful!');
			  }
			});
	  	}
	}
	});
});