var fs = require('fs');
var BBB = require('./bbbs');
var SETTINGS_PATH = '../settings/settings.json';

exports.read = function()
{
  try
  {
    BBB.Info = JSON.parse(fs.readFileSync(SETTINGS_PATH));   
    console.log("settings read successfully.");
  }
  catch(err)
  {
    console.log("error while reading settings : ");
    console.log(err);
  } 
}


  