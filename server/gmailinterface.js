var authToken = require('./authtoken');
var googleApi = require('googleapis');
var schedule = require('node-schedule');

exports.sendMails = function(to, login, password, reservedBBBIDs, reservedBBBIPs, failedBBBIDs, isValidEvent, endDateTime) 
{
    sendReservationDetails(to, login, password, reservedBBBIDs, reservedBBBIPs, failedBBBIDs, isValidEvent);
    scheduleReservationEndNotification(to, reservedBBBIDs, endDateTime);
}

sendReservationDetails = function(to, login, password, reservedBBBIDs, reservedBBBIPs, failedBBBIDs, isValidEvent) 
{

  var email = createReservationDetailsMail(to, login, password);
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

scheduleReservationEndNotification = function(to, reservedBBBIDs, endDateTime) 
{
  var notificationDateTime = new Date(endDateTime);
  notificationDateTime.setUTCMinutes(notificationDateTime.getUTCMinutes() - 5);
  console.log(notificationDateTime);
  schedule.scheduleJob(notificationDateTime, 
                      function()
                      {
                        sendReservationEndNotification(to,reservedBBBIDs,endDateTime);
                      });

}


function sendReservationEndNotification(to, reservedBBBIDs, endDate) 
{
  var email = createReservationEndNotificationMail(to, reservedBBBIDs, endDate);
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

function createReservationDetailsMail(to, login, password, reservedBBBIDs, reservedBBBIPs, failedBBBIDs, isValidEvent)
{
  var email_lines = [];  
  var body = "Password : " + password + ". Login : " + login;
  email_lines.push("To: " + to);
  email_lines.push('Content-type: text/html;charset=iso-8859-1');
  email_lines.push('MIME-Version: 1.0');
  email_lines.push("Subject: Sensenet: Reservation Details");
  email_lines.push("");
  email_lines.push(body);
  return createBase64EncodedEmail(email_lines);
}

function createReservationEndNotificationMail(to, reservedBBBIDs, endDate)
{
  var email_lines = [];  
  var body = "Your reservation ends in 5 minutes. Please save your work.";
  email_lines.push("To: " + to);
  email_lines.push('Content-type: text/html;charset=iso-8859-1');
  email_lines.push('MIME-Version: 1.0');
  email_lines.push("Subject: Sensenet : Reservation ends in 5 min");
  email_lines.push("");
  email_lines.push(body);
  return createBase64EncodedEmail(email_lines);
}


function createBase64EncodedEmail(email_lines)
{
  var email = email_lines.join("\r\n").trim();
  var base64EncodedEmail = (new Buffer(email)).toString('base64');
  base64EncodedEmail.replace(/\+/g, '-').replace(/\//g, '_')
  return base64EncodedEmail;
}