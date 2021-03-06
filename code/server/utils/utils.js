var BBB = require('../settings/bbbs');
var UUID = require('node-uuid');

exports.makeRandomString = function(len)
{
    var randStr = "";
    var possible = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

    for( var i=0; i < len; i++ )
        randStr += possible.charAt(Math.floor(Math.random() * possible.length));

    return randStr;
}

exports.validateBBBIDs = function(ids)
{
  var numIds = ids.length;  
  var validIDs = [];
  var reservedIPs = [];
  var failedIDs = [];
  var errorMessages = [];
  var numIds = ids.length;
  for(var i = 0; i < numIds; i++)
  { 
    var exists = false;
    var id = ids[i];
    var bbb = BBB.Info[id];
    //console.log(bbb.Reservable);
    if(!bbb)
    {
      failedIDs.push({id:id, message:"device does not exist."});
    }
    else if(!bbb.Reservable)
    {
      failedIDs.push({id:id, message:"device is not reservable."});  
    }
    else if(!bbb.Configured)
    {
     failedIDs.push({id:id, message:"device is not configured."}); 
    }
    else if(bbb.Reachability != "up")
    {
     failedIDs.push({id:id, message:"device is down."});  
    }
    else if(!bbb.CalendarId)
    {
     failedIDs.push({id:id, message:"device does not have a calendar."});   
    }
    else
    {
      var bbbPort = bbb.Port;
      validIDs.push(id);
      reservedIPs.push(bbbPort);
      errorMessages.push[""];
    }
  }
  return [validIDs, reservedIPs, failedIDs];
 }

/* use a function for the exact format desired... */
exports.ISODateString = function(d)
{
   function pad(n){return n<10 ? '0'+n : n}
   return d.getUTCFullYear()+'-'
        + pad(d.getUTCMonth()+1)+'-'
        + pad(d.getUTCDate())+'T'
        + pad(d.getUTCHours())+':'
        + pad(d.getUTCMinutes())+':'
        + pad(d.getUTCSeconds())+'Z'
}

exports.RFC339ToString = function(rfc339Str)
{
  var d = new Date(rfc339Str);
  var dformat = [(d.getMonth()+1).padLeft(),
               d.getDate().padLeft(),
               d.getFullYear()].join('/') +' ' +
              [d.getHours().padLeft(),
               d.getMinutes().padLeft(),
               d.getSeconds().padLeft()].join(':');
  return dformat;         
}


Number.prototype.padLeft = function(base,chr)
{
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}

exports.getUUID=function()
{
  // Google Calendar does not allow '-' character in ids of events.
  // So, remove this character.
  return UUID.v4().replace(new RegExp('-', 'g'), '');
}

exports.removeLastCharacter = function(string)
{
  if(string.length > 0)
  {
    string = string.slice(0, -1);
  }
  return string;
}

exports.getUserKey = function(keys, keyName)
{
    var numKeys = keys.length;
    var matchedKey = null;
    for(var i=0; i < numKeys; i++)
    {
       if(keys[i].name == keyName)
       {
         matchedKey = keys[i];
         break;
       }
    }
    return matchedKey;
}