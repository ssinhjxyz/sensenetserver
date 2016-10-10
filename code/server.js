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
var admins = require('./server/authorization/admins');
var ADMINS = require('./server/settings/admins');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

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

app.post('/deletebbb', urlencodedParser, function(req, res)
{
    console.log(req.body.id);
    delete BBB.Info[req.body.id];
    console.log(BBB.Info);
    res.end(JSON.stringify({status:"ok"}));
});

app.post('/reserve', urlencodedParser, function(req, res)
{
   var response = {};
   var login = req.body.emailId.match(/^([^@]*)@/)[1];
   var response = 
   {
      login  : login 
   };
   var ids = req.body.bbbIds;
   console.log(req.body);
   reservationCreator.create( req.body, function(password, reservedBBBIDs, reservedBBBIPs, failedBBBIDs, isValidEvent)
     {
       response.password = password;
       response.reservedBBBIDs = reservedBBBIDs;
       response.reservedBBBIPs = reservedBBBIPs;
       response.failedBBBIDs = failedBBBIDs;
       response.isValidEvent = isValidEvent;
       response.loginMethod = req.body.loginMethod;
       res.end(JSON.stringify(response));
    });
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

app.post('/authenticate', urlencodedParser, function(req, res)
{
    var emailId = req.body.emailId;
    users.getAllEmails(function(result, userEmails)
    {
      var valid = false;
      var match = userEmails.indexOf(emailId);
      if(match > -1)
      {
        valid = true;
      }
      res.end(JSON.stringify({valid:valid}));
    });     
});

app.post('/authorizeadmin', urlencodedParser, function(req, res)
{
    var authorized = admins.authorize(req.body.emailId);
    res.end(JSON.stringify({authorized:authorized}));     
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

app.get('/usercredentials', urlencodedParser, function(req, res)
{
  console.log(req.query.emailId);
  var emailId = req.query.emailId;
  console.log(emailId);
  users.getCredentials(emailId, function(password)
  {
    res.end(JSON.stringify(password));
  });    
});

app.post('/refreshadminlist', urlencodedParser, function(req, res)
{ 
   admins.refresh();
   console.log(ADMINS.List);
});


app.post('/getadminlist', urlencodedParser, function(req, res)
{ 
   res.end(JSON.stringify(ADMINS.List));
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

app.post('/addkey', urlencodedParser, function(req, res)
{
      // create an incoming form object
      var form = new formidable.IncomingForm();
      var uploadDir = "./server/uploads";
      var inputs = {};

      // store all uploads in the /uploads directory
      form.uploadDir =  uploadDir;
      
      // create uploads folder if it does not exist
      if (!fs.existsSync(uploadDir))
      {
          fs.mkdirSync(uploadDir);
          console.log("creating uploads folder");
      }

      // When a field has been parsed.
      form.on('field', function(key, value) {
        inputs[key] = value;
        console.log(key + ":" + value);
      });

      // When a file has been received
      form.on('file', function(field, file) {
          inputs.fileName = path.join(form.uploadDir, file.name);
          fs.rename(file.path, inputs.fileName);
      });
    
      // log any errors that occur
      form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
      });

      // once all the files have been uploaded, send a response to the client
      form.on('end', function() 
      {
        fs.readFile(inputs.fileName, "utf8", function(err, data)
        {
           users.addKey(inputs.emailId, inputs.name, data, function(status)
            {
              res.end(JSON.stringify(status));
            });
        });
      });
      // parse the incoming request containing the form data
      form.parse(req);
});

readSettings.read();
reachabilityChecker.start();  
connection.connect();