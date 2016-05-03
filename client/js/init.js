$(function(){
	$('#endDateTime').data("DateTimePicker").date(moment());
	$('#startDateTime').data("DateTimePicker").date(moment());
	$("#reserve").prop("disabled",false);
});
