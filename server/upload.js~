var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var uploadDir = '/uploads';



exports.upload = function(req, res) {
      
      // body...
      // create an incoming form object
      var form = new formidable.IncomingForm();


      // store all uploads in the /uploads directory
      form.uploadDir = path.join(__dirname, '/uploads');
      
      console.log("creating uploads folder");      
      // create uploads folder if it does not exist
      if (!fs.existsSync(form.uploadDir)){
          fs.mkdirSync(form.uploadDir);
      }

      // every time a file has been uploaded successfully,
      // rename it to it's orignal name
      form.on('file', function(field, file) {
        fs.rename(file.path, path.join(form.uploadDir, "publickey"));
      });
    
      // log any errors that occur
      form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
      });

      // once all the files have been uploaded, send a response to the client
      form.on('end', function() {
        res.end('success');
      });

      // parse the incoming request containing the form data
      form.parse(req);

    };

   