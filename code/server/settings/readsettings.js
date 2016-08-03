var fs = require('fs');
var BBB = require('./bbbs');
var BBB_SETTINGS_PATH = '../settings/bbb.json';

exports.read = function()
{
  try
  {
    BBB.Info = JSON.parse(fs.readFileSync(BBB_SETTINGS_PATH));   
    console.log("settings read successfully.");
  }
  catch(err)
  {
    console.log("error while reading settings : ");
    console.log(err);
  } 
}


  