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

Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}