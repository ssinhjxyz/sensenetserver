var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var reservationCreator = require('./reservationcreator');
var uploadDir = './server/uploads';

exports.do = function(req, res, callback) 
{
      var inputs = {};
      // body...
      // create an incoming form object
      var form = new formidable.IncomingForm();

      // store all uploads in the /uploads directory
      form.uploadDir =  uploadDir;
      
      // create uploads folder if it does not exist
      if (!fs.existsSync(uploadDir)){
          fs.mkdirSync(uploadDir);
          console.log("creating uploads folder");
      }

      // When a field has been parsed.
      form.on('field', function(key, value) {
        inputs[key] = value;
        console.log(key + ":" + value);
      });

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
         
      });

      // parse the incoming request containing the form data
      form.parse(req);

    };
