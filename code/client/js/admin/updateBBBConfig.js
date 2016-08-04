var changedConfigs = {};
var changedHTML = [];

function sendBBBConfigToServer()
{
	var data = {};
	data.configs = JSON.stringify(changedConfigs);
	$("#updateBBBConfig").attr("disabled","true");
    $.ajax({
      type: "POST",
      url: "/updatebbbconfig",
      traditional: true,
      data:data
    }).done(function()
    {
    	$("#updateBBBConfig").removeAttr("disabled");
    	resetChangedHTML();
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
	var bbbId = $(htmlElem).data("id");
	var property = $(htmlElem).data("property");
	$(htmlElem).addClass("changed");
	var value = $(htmlElem).html();
	if(!changedConfigs[bbbId])
	{
		changedConfigs[bbbId] = {};
	}
	changedConfigs[bbbId][property] = value;
	changedHTML.push(htmlElem);
}
