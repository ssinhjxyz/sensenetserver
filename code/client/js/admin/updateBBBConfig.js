var changedConfigs = {};
var changedHTML = [];

function sendBBBConfigToServer()
{
	var data = {};
	data.configs = JSON.stringify(changedConfigs);
	$("#updateBBBYes").attr("disabled","true");
    $.ajax({
      type: "POST",
      url: "/updatebbbconfig",
      traditional: true,
      data:data
    }).done(function()
    {
    	$("#updateBBBYes").removeAttr("disabled");
    	resetChangedHTML();
    	$("#updateBBBLaunchModal").attr("disabled","true");
    	changedConfigs = {};
    	changedHTML = [];
    });  
}

function resetChangedHTML()
{
	var numChanged = changedHTML.length;
	for(var i=0; i < numChanged; i++)
	{
		$(changedHTML[i]).removeClass("changed");
	}
}

function addToChangedConfigs(htmlElem)
{
	$("#updateBBBLaunchModal").removeAttr("disabled");
	var bbbId = $(htmlElem).data("id");
	var property = $(htmlElem).data("property");
	$(htmlElem).addClass("changed");
	var value = $(htmlElem).html();
	if(value === "false")
		value = false;
	else if(value === "true")
		value = true;
	if(!changedConfigs[bbbId])
	{
		changedConfigs[bbbId] = {};
	}
	changedConfigs[bbbId][property] = value;
	changedHTML.push(htmlElem);
}
