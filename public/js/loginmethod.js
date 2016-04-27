$( function(){
	
	$("#pwdlogin").click(
	function(){
		$("#uploadForm").hide();
		$("#reserve").prop("disabled",false);
	});

	$("#rsalogin").click(
	function(){
		$("#uploadForm").show();
		$("#reserve").prop("disabled",true);
	});
});



