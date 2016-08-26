var express = require('express');
var app = express();
app.use(express.static('client'));
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var https = require("https");
var utils = require('./server/utils/utils');
var BBB = require('./server/settings/bbbs');
var reservationCreator = require('./server/reservations/reservationcreator');
var upload = require('./server/reservations/upload');
var addbbb = require('./server/administration/configurebbb');
var updateBBBConfig = require('./server/administration/updatebbbconfig');
var googleAuth = require('./server/authentication/googleauth');
var reachabilityChecker = require('./server/administration/reachabilitychecker');
var myReservations = require('./server/reservations/myreservations');
var gcalInterface = require('./server/reservations/gcalinterface');
var readSettings = require('./server/settings/readsettings');
var connection = require('./server/database/connection');
var users = require('./server/database/users');

app.set('port', (process.env.PORT || 80));
app.use(express.static(__dirname + '/public'));
app.listen(app.get('port'), '0.0.0.0', function() 
{
  console.log('Node app is running on port', app.get('port'));
  // We launch the server using sudo as listening to port 80 needs sudo privelges
  // Then we run the server as a user with limited rights to minimize security risks in case the server is compromised.
   process.setuid(1003);
});


app.get('/', function (req, res) 
{
    res.sendFile(__dirname + "/client/html/" + "home.html" );
})


app.get('/reservations', function (req, res) 
{
    res.sendFile( __dirname + "/client/html/" + "reservations.html" );
})


app.get('/admin', function (req, res) 
{
    res.sendFile( __dirname + "/client/html/" + "admin.html" );
})


app.post('/configurebbb', urlencodedParser, function(req, res)
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

app.get('/myreservations', urlencodedParser, function(req, res)
{
    var emailId = req.query.emailId;
    myReservations.get(emailId, res);
});

app.get('/deletereservation', urlencodedParser, function(req, res)
{
    var eventId = req.query.eventId;
    var calendarId = req.query.calendarId;
    gcalInterface.deleteEvent(eventId, calendarId, res);
});

app.post('/updatebbbconfig', urlencodedParser, function(req, res)
{
    updateBBBConfig.update(req, res);
});

app.post('/adduser', urlencodedParser, function(req, res)
{
    var emailId = req.body.emailId; 
    users.addUnique(emailId, function(result)
    {
      if(result.status == "error")
      {
        console.log(result.status);
        console.log(result.message);  
      }
      res.end();
    });
});

app.post('/deleteuser', urlencodedParser, function(req, res)
{
    var emailId = req.body.emailId;
    console.log(emailId);
    users.delete(emailId, function(result)
    {
      if(result.status == "error")
      {
        console.log(result.status);
        console.log(result.message);  
      }
      res.end();
    });    
});

app.get('/userinfo', urlencodedParser, function(req, res)
{
  users.getAllEmails(function(result, userEmails)
  {
    res.end(JSON.stringify(userEmails));
  });    
});

app.get('/userpassword', urlencodedParser, function(req, res)
{
  var emailId = req.query.emailId;
  console.log(emailId);
  users.getPassword(emailId, function(password)
  {
    res.end(JSON.stringify(password));
  });    
});

app.post('/updateuserpassword', urlencodedParser, function(req, res)
{
    var emailId = req.body.emailId;
    var newPassword = req.body.newPassword;
    users.updatePassword(emailId, newPassword, function(result)
    {
      if(result.status == "error")
      {
        console.log(result.status);
        console.log(result.message);  
      }
      res.end();
    });    
});


readSettings.read();
reachabilityChecker.start();  
connection.connect();