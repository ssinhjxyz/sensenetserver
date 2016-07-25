var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var reservationCreator = require('./reservationcreator');
var uploadDir = '/uploads';

exports.do = function(req, res, callback) 
{
      var inputs = {};
      // body...
      // create an incoming form object
      var form = new formidable.IncomingForm();

      // store all uploads in the /uploads directory
      form.uploadDir = path.join(__dirname, 'uploads');
      
      // create uploads folder if it does not exist
      if (!fs.existsSync(form.uploadDir)){
          fs.mkdirSync(form.uploadDir);
          console.log("creating uploads folder");
      }

      // When a field has been parsed.
      form.on('field', function(key, value) {
        inputs[key] = value;
      });

      // every time a file has been uploaded successfully,
      // rename it to it's orignal name
      form.on('file', function(field, file) {
          fs.rename(file.path, path.join(form.uploadDir, file.name));
      });
    
      // log any errors that occur
      form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
      });

      // once all the files have been uploaded, send a response to the client
      form.on('end', function() 
      {
         var response = {};
         var login = inputs.emailId.match(/^([^@]*)@/)[1];
         var response = 
         {
            login  : login 
         };
         var ids = inputs.bbbIds.split(",");
         reservationCreator.create( ids, inputs.emailId, inputs.start, inputs.end, login, 
            inputs.loginMethod, inputs.uid, inputs.deleteKey, function(password, reservedBBBIDs, reservedBBBIPs, failedBBBIDs, isValidEvent)
           {
             response.password = password;
             response.reservedBBBIDs = reservedBBBIDs;
             response.reservedBBBIPs = reservedBBBIPs;
             response.failedBBBIDs = failedBBBIDs;
             response.isValidEvent = isValidEvent;
             res.end(JSON.stringify(response));
          });
      });

      // parse the incoming request containing the form data
      form.parse(req);

    };
