var express = require('express');
var app = express();
app.use(express.static('client'));
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var https = require("https");
var util = require('util');
var BBB = require('./server/bbbs');
var accessScheduler = require('./server/accessScheduler');
var upload = require('./server/upload');
var gcalInterface = require('./server/upload');
var googleAuth = require('./server/googleAuth');

app.set('port', (process.env.PORT || 80));
app.use(express.static(__dirname + '/public'));
app.listen(app.get('port'), '0.0.0.0', function() 
{
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
  googleAuth.authorize(JSON.parse(content), function(){});
});


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
   gcalInterface.validateEvent(startDateTime, endDateTime, 
   function(isValidEvent)
   {
      if(isValidEvent)
      {
        gcalInterface.createEvents(ids, emailId, startDateTime, endDateTime);
        var password = accessScheduler.schedule(ids, startDateTime, endDateTime, login, loginMethod, uid); 
      } 
      callback(password, results[0], results[1], results[2], isValidEvent);
   });
}