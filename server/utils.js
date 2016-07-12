var BBB = require('./settings/bbbs');


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
    var bbb = getBBBFromId(id);
    if(bbb != null)
    {
      var bbbPort = bbb.Port;
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

getBBBFromId = function(id)
{
  var matchingBBB = null;
  var matchingBBBs = $.grep(BBB.Info, function(bbb)
  {
    return bbb.ID == id;
  });
  if(matchingBBBs.length == 1)
  {
     matchingBBB = matchingBBBs[0];
  }
  return matchingBBB;
}