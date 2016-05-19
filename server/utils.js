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
  var reservedIDs = [];
  var reservedIPs = [];
  var failedIDs = [];
  var numIds = ids.length;
  for(var i = 0; i < numIds; i++)
  { 
    var id = ids[i];
    var bbbIP = BBB.IPS[ids[i]];
    if(bbbIP)
    {
      reservedIDs.push(id);
      reservedIPs.push(bbbIP);
    }
    else
    {
      failedIDs.push(id);
    }
  }
  return [reservedIDs, reservedIPs, failedIDs];
 }

