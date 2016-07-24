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
	var	dformat = [d.getMonth()+1,
	d.getDate(),
	d.getFullYear()].join('/')+' '+
	[d.getHours(),
	d.getMinutes(),
	d.getSeconds()].join(':');
	return dformat;
        	
}