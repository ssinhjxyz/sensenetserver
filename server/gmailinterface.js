var authToken = require('./authToken');

exports.sendEmail = function(to, login, password, reservedBBBIDs, reservedBBBIPs, failedBBBIDs, isValidEvent) 
{

  var email = createBase64EncodedEmail(to, login, password);
  var gmail = googleApi.gmail('v1');
  var request = gmail.users.messages.send({
    auth: authToken.token,
    userId: 'ssingh28@ncsu.edu',
    resource: 
    {
      raw: email
    }
  }, function(err,response){
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    if (response) {
      console.log('The API returned a response: ' + response);
      return;
    }
  });
}

function createBase64EncodedEmail( to, login, password, reservedBBBIDs, reservedBBBIPs, failedBBBIDs, isValidEvent)
{
  var email_lines = [];  
  var body = "Password : " + password + ". Login : " + login;
  email_lines.push("To: " + to);
  email_lines.push('Content-type: text/html;charset=iso-8859-1');
  email_lines.push('MIME-Version: 1.0');
  email_lines.push("Subject: Sensenet Reservation");
  email_lines.push("");
  email_lines.push(body);
  var email = email_lines.join("\r\n").trim();
  var base64EncodedEmail = (new Buffer(email)).toString('base64');
  base64EncodedEmail.replace(/\+/g, '-').replace(/\//g, '_')
  return base64EncodedEmail;

}