var express = require('express');
var app = express();
app.use(express.static('client'));
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var schedule = require('node-schedule');
var SCOPES = ['https://www.googleapis.com/auth/calendar'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = 'calendar-nodejs-quickstart.json';
var https = require("https");

var fs = require('fs');
var util = require('util');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var CALENDAR = require('./server/calendars');
var BBB = require('./server/bbbs');
var upload = require('./server/upload');
var globalAuth;

app.set('port', (process.env.PORT || 80));
app.use(express.static(__dirname + '/public'));
app.listen(app.get('port'), '0.0.0.0', function() {
  console.log('Node app is running on port', app.get('port'));
  // Reference: http://syskall.com/dont-run-node-dot-js-as-root/
  // Find out which user used sudo through the environment variable
  var uid = parseInt(process.env.SUDO_UID);
  // Set our server's uid to that user
   if (uid) 
   {
     process.setuid(uid);
   }

});


app.get('/', function (req, res) {
    res.sendFile(__dirname + "/client/html/" + "home.html" );
})


app.get('/reservations', function (req, res) {
    res.sendFile( __dirname + "/client/html/" + "reservations.html" );
})


app.get('/admin', function (req, res) {
    res.sendFile( __dirname + "/client/html/" + "admin.html" );
})


app.post('/reserve', urlencodedParser, function (req, res) {

   // Fetch parameters from request
   var emailId = req.body.emailId;
   var startDateTime = req.body.startDateTime;
   var endDateTime = req.body.endDateTime;
   var ids = req.body.ids;
   var uid = req.body.uid;

   // case when single id is sent. 
   // TODO: this should ideally be handled using JSON
   if(typeof ids == "string")
   {
      ids = [parseInt(ids)];
   }

   var loginMethod = req.body.loginMethod
   console.log("loginMethod : " + loginMethod);
   var login = emailId.match(/^([^@]*)@/)[1];
   var response = 
   {
      login  : login,
      password : "" 
   };

   createReservation( ids, emailId, startDateTime, endDateTime, login, loginMethod, uid, 
		      function(password, reservedBBBIDs, reservedBBBIPs, failedBBBIDs, isValidEvent)
			{
			  response.password = password;
			  response.reservedBBBIDs = reservedBBBIDs;
			  response.reservedBBBIPs = reservedBBBIPs;
			  response.failedBBBIDs = failedBBBIDs;
        response.isValidEvent = isValidEvent;
			  res.end(JSON.stringify(response));
			});

})

app.post('/upload', urlencodedParser, function(req, res)
{
  	upload.do(req, res);
});


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
  fs.readFile(TOKEN_PATH, function(err, token) 
  {
    if (err) 
    {
      getNewToken(oauth2Client, callback);
    } 
    else 
    {
      oauth2Client.credentials = JSON.parse(token);
      globalAuth = oauth2Client;
      callback(oauth2Client);
    }
  });
}

/**
 * Validate the event : requested event should not overlap with an existing event
 *
 */
function validateEvent(startTime, endTime, callback) {
  var calendar = google.calendar('v3');
  calendar.events.list({
    auth: globalAuth,
    calendarId: 'primary',
    timeMin: startTime,
    timeMax: endTime,
    maxResults: 1,
    singleEvents: true,
    orderBy: 'startTime'
  }, 
  function(err, response) 
  {
    if (err)
    {
      console.log('The API returned an error: ' + err);
      return;
    }
    if (response.items.length > 0) 
    {
      callback(false);
    } 
    else
    {
      callback(true);
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

function makeRandomString(len)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < len; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function validateBBBIDs(ids)
{
  var reservedIDs = [];
  var reservedIPs = [];
  var failedIDs = [];
  var numIds = ids.length;
  for(var i = 0; i < numIds; i++)
  { 
    var id = ids[i];
    var bbbIP = BBB.IPS[ids[i]];
    if(bbbIP)
    {
      reservedIDs.push(id);
      reservedIPs.push(bbbIP);
    }
    else
    {
      failedIDs.push(id);
    }
  }

  return [reservedIDs, reservedIPs, failedIDs];
 
}


function createReservation(ids, emailId, startDateTime, endDateTime, login, loginMethod, uid, callback){
  
   var results = validateBBBIDs(ids);
   validateEvent(startDateTime, endDateTime, 
   function(isValidEvent){
      if(isValidEvent)
      {
        createGCalEvents(ids, emailId, startDateTime, endDateTime);
        var password = scheduleAccess(ids, startDateTime, endDateTime, login, loginMethod, uid); 
      } 
      callback(password, results[0], results[1], results[2], isValidEvent);
   });
}



function createGCalEvents(ids, emailId, startDateTime, endDateTime){
  
  var numIds = ids.length;
  for(var i = 0; i < numIds; i++)
  { 
    var calendarId = CALENDAR.IDS[ids[i]];
    if(calendarId)
    {
      console.log("creating event for bbb " + ids[i]);
      createGCalEvent( ids[i], calendarId, emailId, startDateTime, endDateTime);
    }
  }
}


function createGCalEvent( bbbId, calendarId, emailId, startDateTime, endDateTime){

  var calendar = google.calendar('v3');
  var attendees = [{'email':emailId}];

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
  
});}


function scheduleAccess(ids, startDateTime, endDateTime, login, loginMethod, uid)
{
  console.log(loginMethod);
  var password = "";
  if(loginMethod === "password")
  {
    password = makeRandomString(6);
  }

  var numIds = ids.length;
  for(var i = 0; i < numIds; i++)
  { 
    var bbbIP = BBB.IPS[ids[i]];
    if(bbbIP)
    {
      if(loginMethod === "password")
      {
        schedulePasswordAccess(startDateTime, endDateTime, bbbIP, password, login);
      }
      else if (loginMethod === "rsa")
      {
        scheduleRSAAccess(startDateTime, endDateTime, login, bbbIP, uid);
      }
    }
  }
  return password 
}


function scheduleRSAAccess(startDateTime, endDateTime, login, bbbIP, uid)
{
 
  var addUserCommand = "sh ./server/adduser.sh " + bbbIP + " papAq5PwY/QQM " + login;
  var addPublicKeyCommand = "sh ./server/addpublickey.sh " + bbbIP + " " + login + " " + uid;
  // first create the user, then add the public key
  var createReservation = schedule.scheduleJob(startDateTime, function()
  {
    exec(addUserCommand,
    function (error, stdout, stderr) 
    {
      console.log("user " + login + " created");
    	exec(addPublicKeyCommand,    	
    	function (error, stdout, stderr) 
    	{
    	      	//console.log("public key " + login + " added");
    	      	console.log('stdout: ' + stdout);
    	      	//console.log('stderr: ' + stderr);
    	      	if (error !== null) 
              {
    			       console.log('exec error: ' + error);
    	      	}
      	});
        if (error !== null) 
        {
          console.log('exec error: ' + error);
        }
      });
    });
  	
   var deleteUserCommand = "sh ./server/deleteuser.sh " + bbbIP + " " + login;
   var endReservation = schedule.scheduleJob(endDateTime, function(){
      exec(deleteUserCommand,
      function (error, stdout, stderr) {
        console.log("user " + login + " deleted");
        if (error !== null) {
          console.log('exec error: ' + error);
        }
    });
  });
}


function schedulePasswordAccess(startDateTime, endDateTime, bbbIP, password, login)
{  
  var python = spawn('python', ["./server/encodepassword.py", password]);
  python.stdout.on('data', 
  function(encpasswd)
  { 
  var command = "sh ./server/adduser.sh " + bbbIP + " " + encpasswd.toString().slice(0,-1) + " " + login;
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
	
    var killUser = schedule.scheduleJob(endDateTime, function(){
    exec("sh ./server/deleteuser.sh " + bbbIP + " " + login,
    function (error, stdout, stderr) {
      console.log("user " + login + " deleted");
      if (error !== null) {
        console.log('exec error: ' + error);
      }
   }); }); });
}

