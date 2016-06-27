var BBB = require('./bbbs');


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
  
  var reservedIDs = [];
  var reservedIPs = [];
  var failedIDs = [];
  var errorMessages = [];
  var numIds = ids.length;
  for(var i = 0; i < numIds; i++)
  { 
    var exists = false;
    var id = ids[i];
    var bbbPort = BBB.Info[id].Port;
    if(bbbPort)
    {
      reservedIDs.push(id);
      reservedIPs.push(bbbPort);
      errorMessages.push[""];
    }
    else
    {
      failedIDs.push({id:id, message:"device does not exist."});
    }
  }
  return [reservedIDs, reservedIPs, failedIDs];
 }

