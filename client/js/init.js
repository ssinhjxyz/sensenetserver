$(function()
{
	$('#endDateTime').data("DateTimePicker").date(moment());
	$('#startDateTime').data("DateTimePicker").date(moment());
	$("#reserve").prop("disabled",false);
	$("#reserve").click(function(event){reserve(event)});
	$("#showReservationDetails").hide();
	$("#myReservationsLink").click(function(event){myReservations()});
	$(window).resize(function(event)
	{
		var newHeight = $(window).height()-70;
		$("#sensenetInterface").height(newHeight);

	});
});
