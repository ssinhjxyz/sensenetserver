function getExtension(filename)
{
	return filename.split('.').pop();
}

function getEmailUserName(email)
{
	return email.match(/^([^@]*)@/)[1]; 	
}
