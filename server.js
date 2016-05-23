var express = require('express');
var app = express();
app.use(express.static('client'));
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var https = require("https");
var util = require('util');
var BBB = require('./server/bbbs');
var reservationCreator = require('./server/reservationcreator');
var upload = require('./server/upload');
var googleAuth = require('./server/googleauth');
var reservationCreator = require('./server/reservationcreator')

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



})

app.post('/upload', urlencodedParser, function(req, res)
{
  	upload.do(req, res);
});

