var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var schedule = require('node-schedule');
var globalAuth;

var SCOPES = ['https://www.googleapis.com/auth/calendar'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = 'calendar-nodejs-quickstart.json';


app.use(express.static('public'));

var https = require("https");
var fs = require("fs");

var util = require('util');
var exec = require('child_process').exec;

var util = require('util');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var CALENDAR = require('./calendars');


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


app.get('/', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
})

app.post('/schedule', urlencodedParser, function (req, res) {

   // Fetch parameters from request
   var emailId = req.body.emailId;
   var bbbId = req.body.bbbId;
   var startDateTime = req.body.startDateTime;
   var endDateTime = req.body.endDateTime;
   var password = makeRandomString(6);
   var login = emailId.match(/^([^@]*)@/)[1];
   createEvent( bbbId, emailId, startDateTime, endDateTime, password, login);
   var response = {
    login  : login,
    password : password 
    };
   res.end(JSON.stringify(response));
})



// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Google Calendar API.
  authorize(JSON.parse(content), function(){});
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      globalAuth = oauth2Client;
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

function scheduleAccess(startDateTime, endDateTime, password, login)
{
  
  var start = new Date(startDateTime);
 
  var python = spawn('python', ["createuser.py", password]);
  python.stdout.on('data', 
	function(encpasswd)
	{ 
	var command = 'ssh root@192.168.7.2 "useradd -m -p ' + encpasswd.toString().slice(0,-1) + ' ' + login + ' "';
	var createUser = schedule.scheduleJob(startDateTime, function(){
	  exec(command,
	  function (error, stdout, stderr) {
	    console.log("user " + login + " created");
	    //console.log('stdout: ' + stdout);
	    //console.log('stderr: ' + stderr);
	    if (error !== null) {
	      console.log('exec error: ' + error);
	    }
	});});

	var end = new Date(endDateTime);
	  var killUser = schedule.scheduleJob(endDateTime, function(){
	exec('ssh root@192.168.7.2 "killall --user ' + login + ' ; userdel -f ' + login + '"',
	  function (error, stdout, stderr) {
	    console.log("user " + login + " killed");
	    //console.log('stdout: ' + stdout);
	    //console.log('stderr: ' + stderr);
	    if (error !== null) {
	      console.log('exec error: ' + error);
	    }
	});});
					  
	});

   return password;
  
}

function makeRandomString(len)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < len; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function getBBBIds(userinput)
{
    var splitIds = userinput.split(",");
    var ids = [];
    var numIds = splitIds.length;
    for (var i = Things.length - 1; i >= 0; i--) 
    {
      
    };
}

function getRange(rangeStr)
{
  var start = -1;
  var end = -1;
  var splitIds = rangeStr.split("-");
  if( 2 === splitIds.length)
  {
    start = splitIds[0];
    end = splitIds[1];
  }
  return [start,end];
}


function createEvent( bbbId, emailId, startDateTime, endDateTime, password, login){

  var calendar = google.calendar('v3');
  var attendees = [{'email':emailId}];
  var calendarId = CALENDAR.IDS[1];

  // stored credentials.
  var event = {
    'summary': "Sensenet Reservation",
    'location': "BBB " + bbbId,
    'description': 'Reservation for a BBB',
    'start': {
      'dateTime': startDateTime,
      'timeZone': 'Etc/UTC',
    },
    'end': {
      'dateTime': endDateTime,
      'timeZone': 'Etc/UTC',
    },
    'attendees': attendees,
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10},
      ],
    },
  };

calendar.events.insert({
  auth: globalAuth,
  calendarId: calendarId,
  sendNotifications:true,
  resource: event,
}, function(err, event) {
  if (err) {
    console.log('There was an error contacting the Calendar service: ' + err);
    return;
  }
  console.log('Event created with ' + attendees[0].email);
  console.log('Start : ' + startDateTime + ' | End : ' + endDateTime);
  //scheduleAccess(startDateTime, endDateTime, password, login);
});

}
