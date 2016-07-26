var fs = require('fs');
var BBB = require('./settings/bbbs');
var SETTINGS_PATH = '../settings/settings.json';

exports.read = function()
{
  try
  {
    BBB.Info = JSON.parse(fs.readFileSync(SETTINGS_PATH));
    console.log("settings read successfully.");
    console.log(BBB.Info);
  }
  catch(err)
  {
    console.log("error while reading settings : ");
    console.log(err);
  } 
}



  