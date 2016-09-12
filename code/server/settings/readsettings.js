var fs = require('fs');

var BBB = require('./bbbs');
var ADMINS = require('./admins');
var DATABASE = require('./database');

var BBB_SETTINGS_PATH = '../settings/bbb.json';
var DATABASE_SETTINGS_PATH = '../settings/database.json';
var ADMIN_LIST_PATH = '/etc/opt/sensenetserver/adminList.json';

exports.read = function()
{
  try
  {
    BBB.Info = JSON.parse(fs.readFileSync(BBB_SETTINGS_PATH));   
    DATABASE.Info = JSON.parse(fs.readFileSync(DATABASE_SETTINGS_PATH));   
    ADMINS.List = JSON.parse(fs.readFileSync(ADMIN_LIST_PATH));  
    console.log(ADMINS.List); 
    console.log("settings read successfully.");
  } 
  catch(err)
  {
    console.log("error while reading settings : ");
    console.log(err);
  } 
}


  