var express = require('express');
var app = express();
app.use(express.static('client'));
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var https = require("https");
var util = require('util');
var BBB = require('./server/settings/bbbs');
var reservationCreator = require('./server/reservationcreator');
var upload = require('./server/upload');
var addbbb = require('./server/addbbb');
var googleAuth = require('./server/authentication/googleauth');
var reachabilityChecker = require('./server/reachabilitychecker');

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


app.post('/addbbb', urlencodedParser, function(req, res)
{
  	addbbb.add(req, res);
});


app.post('/reserve', urlencodedParser, function(req, res)
{
    upload.do(req, res);
});

app.get('/bbbinfo', urlencodedParser, function(req, res)
{
    var response = 
         {
            info  : BBB.Info 
         };
    res.end(JSON.stringify(response));
});


reachabilityChecker.start();   