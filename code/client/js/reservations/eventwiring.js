$(function()
{
	$('#endDateTime').data("DateTimePicker").date(moment().add(32,'m'));
	$('#startDateTime').data("DateTimePicker").date(moment().add(2,'m'));
	$("#reserve").prop("disabled",false);
	$("#reserve").click(function(event){reserve(event)});
	$("#showReservationDetails").hide();
	$("#myReservationsLink").click(function(event){showMyReservations()});
	$("#createReservationLink").click(function(event){showCreateReservation()});
	$("#myCredentialsLink").click(function(event){showMyCredentials()});
	$("#deviceLocationsLink").click(function(event){showDeviceLocations()});
	$("#showEditPasswordWindow").click(function(event){$("#editPasswordWindow").modal("show");})
	$("#updatePassword").click(function(event){updatePassword()});
	$('#upload-btn').on('click', function (){
	    $('#upload-input').click();
	});

	$('#upload-input').on('change', function()
	{
		var files = $('#upload-input').get(0).files;
	    if(1 == files.length)
	    {
	    	$("#uploadedFile").html(files[0].name);
	    }
	});

	$("#pwdlogin").click(
	function(){
		$('#keyList').selectpicker('hide');
	});

	$("#rsalogin").click(
	function(){
		$('#keyList').selectpicker('show');
	});

	$('#keyList').selectpicker('hide');
	$("#addKey").click(function(event){addKey(event)});
	$("#viewPassword").click(function(event){showHidePassword(event)});
	$("#getSMSToggle").click(function(event){$("#cellphoneNumber").toggle()});
	$("#eb2_csc_1").click(function(event){renderImage("images/eb2_csc_1.jpg")});
	$("#eb2_csc_2").click(function(event){renderImage("images/eb2_csc_2.jpg")});
	$("#eb2_csc_3").click(function(event){renderImage("images/eb2_csc_3.jpg")});
	$("#eb2_ece_1").click(function(event){renderImage("images/eb2_ece_1.jpg")});
	$("#eb2_ece_2").click(function(event){renderImage("images/eb2_ece_2.jpg")});
	$("#eb2_ece_3").click(function(event){renderImage("images/eb2_ece_3.jpg")});
});
