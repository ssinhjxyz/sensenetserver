function getExtension(filename)
{
	return filename.split('.').pop();
}

function getEmailUserName(email)
{
	return emailId.match(/^([^@]*)@/)[1]; 	
}
