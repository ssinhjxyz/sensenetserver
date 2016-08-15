var fs = require('fs');
var BBB = require('./bbbs');
var DATABASE = require('./database');
var BBB_SETTINGS_PATH = '../settings/bbb.json';
var DATABASE_SETTINGS_PATH = '../settings/database.json';

exports.read = function()
{
  try
  {
    BBB.Info = JSON.parse(fs.readFileSync(BBB_SETTINGS_PATH));   
    DATABASE.Info = JSON.parse(fs.readFileSync(DATABASE_SETTINGS_PATH));   
    console.log("settings read successfully.");
  } 
  catch(err)
  {
    console.log("error while reading settings : ");
    console.log(err);
  } 
}


  