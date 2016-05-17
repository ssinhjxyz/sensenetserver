function sendEmail() 
{

  var email_lines = [];  
  email_lines.push("From: ssingh28@ncsu.edu");
  email_lines.push("To: s.singh.xyz@gmail.com");
  email_lines.push('Content-type: text/html;charset=iso-8859-1');
  email_lines.push('MIME-Version: 1.0');
  email_lines.push("Subject: New future subject here");
  email_lines.push("");
  email_lines.push("And the body text goes here");
  var email = email_lines.join("\r\n").trim();

  var gmail = googleApi.gmail('v1');
  var base64EncodedEmail = (new Buffer(email)).toString('base64');
  base64EncodedEmail.replace(/\+/g, '-').replace(/\//g, '_')

  var request = gmail.users.messages.send({
    auth: auth,
    userId: 'ssingh28@ncsu.edu',
    resource: {
      raw: base64EncodedEmail
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
