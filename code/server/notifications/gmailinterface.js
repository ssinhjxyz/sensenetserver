var authToken = require('../authentication/authtoken');
var googleApi = require('googleapis');
var schedule = require('node-schedule');
var spawn = require('child_process').spawn;
var utils = require('../utils/utils');

exports.sendMails = function(to, login, loginMethod, password, reservedBBBIDs, reservedBBBIPs, failedBBBIDs, startDateTime, endDateTime) 
{
    sendReservationDetails(to, login, loginMethod, password, reservedBBBIDs, reservedBBBIPs, failedBBBIDs, startDateTime, endDateTime);
    scheduleReservationEndNotification(to, reservedBBBIDs, endDateTime);
}

sendReservationDetails = function(to, login, loginMethod, password, reservedBBBIDs, reservedBBBIPs, failedBBBIDs, startDateTime, endDateTime) 
{

  var email = createReservationDetailsMail(to, login, loginMethod, password, reservedBBBIDs, reservedBBBIPs, failedBBBIDs, startDateTime, endDateTime,
    function(email)
    {
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
      });   
    }
    );
  
}

scheduleReservationEndNotification = function(to, reservedBBBIDs, endDateTime) 
{
  var notificationDateTime = new Date(endDateTime);
  notificationDateTime.setTime(notificationDateTime.getTime() - 1000*5*60);
  schedule.scheduleJob(notificationDateTime, 
                      function()
                      {
                        sendReservationEndNotification(to,reservedBBBIDs,endDateTime);
                      });

}


function sendReservationEndNotification(to, reservedBBBIDs, endDate) 
{
  var email = createReservationEndNotificationMail(to, reservedBBBIDs, endDate,
    function(email)
    {
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
    });
}

function createReservationDetailsMail(to, login, loginMethod, password, reservedBBBIDs, reservedBBBIPs, failedBBBIDs, startDateTime, endDateTime, callback)
{
  var email_lines = [];  
  var numReserved = reservedBBBIPs.length;
  var numFailed = failedBBBIDs.length;
  var body = "";
  if(numReserved > 0)
  {
     var loginMethodText, passwordText;
     if(loginMethod == "password")
     {
        loginMethodText = "Login method : Password <br>"; 
        passwordText = "Password : " + password + " <br>";
     }
     else 
     {
        loginMethodText = "Login method : RSA Key <br>"; 
        passwordText = "";
     }
     body += "Reservation starts at " + utils.RFC339ToString(startDateTime) + "<br>";
     body += "Reservation ends at " + utils.RFC339ToString(endDateTime) + "<br>";
     body += loginMethodText;
     body += "Login : " + login + " <br>" ;
     body += passwordText;
     body += " <br> Successful Reservations : <br>";   
     for(var i = 0; i < numReserved; i++)
     {
        body += (i+1) + ". BBB ";
        body += reservedBBBIDs[i] + ", Port : " + reservedBBBIPs[i];
        body += " <br>";
     }
     body += ' <br> Login using the command : "ssh &lt;login&gt;&#64;152.14.87.8 -p &lt;port&gt; "  <br>';   
  }

  if(numFailed > 0)
  { 
     body += " <br> Failed Reservations : <br>";      
     for(var i = 0; i < numFailed; i++)
     {
         body += (i+1) + ". BBB ";
         body += failedBBBIDs[i].id + " : " + failedBBBIDs[i].message;
         body += " <br>";
     }  
  }

  email_lines.push("To: " + to);
  email_lines.push('Content-type: text/html;charset=iso-8859-1');
  email_lines.push('MIME-Version: 1.0');
  email_lines.push("Subject: Sensenet: Reservation Details");
  email_lines.push("");
  email_lines.push(body);
  return createBase64EncodedEmail(email_lines, callback);
}

function createReservationEndNotificationMail(to, reservedBBBIDs, endDate, callback)
{
  var email_lines = [];  
  var body = "Your reservation ends in 5 minutes. Please save your work.";
  email_lines.push("To: " + to);
  email_lines.push('Content-type: text/html;charset=iso-8859-1');
  email_lines.push('MIME-Version: 1.0');
  email_lines.push("Subject: Sensenet : Reservation ends in 5 min");
  email_lines.push("");
  email_lines.push(body);
  return createBase64EncodedEmail(email_lines, callback);
}

function createBase64EncodedEmail(email_lines, callback)
{
  var email = email_lines.join("\r\n").trim();
  var python = spawn('python', ["./server/scripts/base64urlencode.py", email]);
  python.stdout.on('data', 
  function(base64EncodedEmail)
  {
    callback(base64EncodedEmail.toString().slice(0,-1) );
  });
}