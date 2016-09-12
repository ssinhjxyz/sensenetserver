function getExtension(filename)
{
	return filename.split('.').pop();
}

function getEmailUserName(email)
{
	return email.match(/^([^@]*)@/)[1]; 	
}

function rfc339ToString(rfc339)
{
  var d = moment(rfc339).toDate();
	var dformat = [(d.getMonth()+1).padLeft(),
               d.getDate().padLeft(),
               d.getFullYear()].join('/') +' ' +
              [d.getHours().padLeft(),
               d.getMinutes().padLeft(),
               d.getSeconds().padLeft()].join(':');
	return dformat;       	
}

function rfc339ToTicks(rfc339)
{
    var ticks = moment(rfc339).toDate().getTime();
    return ticks;          
}


Number.prototype.padLeft = function(base,chr)
{
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
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
