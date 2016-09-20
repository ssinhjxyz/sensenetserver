var connection = require('../database/connection');
var utils = require('../utils/utils');

exports.addUnique = function(emailId, callback)
{
   getCount(emailId, function(numUsers)
   {
   	 if(numUsers > 0)
   	 {
   	 	callback({status:"error", message:"user already exists."});
   	 }
   	 else
   	 {
   	 	add(emailId, callback);
   	 }
   });
}


exports.addKey = function(emailId, name, key, callback)
{
   getCount(emailId, function(num)
   {
      if(num == 1)
      {
         key = utils.removeLastCharacter(key);
         users = connection.object.collection('users').find();
         var keyExists = false;
         users.each(function(err, user) 
         {
            if(err)
            {
               callback({status:"error", message:"Mongo DB error while fetching user."});
            }
            if(user != null) 
            {
               console.log(user);
               var keys = user.keys;
               var numKeys = keys.length;
               for(var i = 0; i < numKeys; i++)
               {
                  if(keys[i].name == name)
                  {
                     keyExists = true;
                     break;
                  }
               }   
            } 
            else
            {
               if(!keyExists)
               {
                  var users = connection.object.collection('users').update({emailId:emailId}, {'$push':{keys:{ name:name, key:key}}}, 
                  function(err) 
                  {
                       if (err) throw err;
                       callback({status:"ok", message:"Added key successfully."});
                  });
               }
               else
               {
                 callback({status:"error", message:"A key with the same name already exists."}); 
               }      
            }
         });      
      }
      else
      {
         callback({status:"error", message:"User does not exist."});
      }
   });
}


getCount = function(emailId, callback)
{
   var users = connection.object.collection('users').find({"emailId":emailId});
   users.count(function(err, numUsers)
   	{
   		if(err)
   		{
   			console.log("Error while getting count in Mongo DB: " + err);
   			callback(-1);
   		}
   		else
   		{
   			console.log(numUsers);
   			callback(numUsers);
   		}
   	});
}

add = function(emailId, callback)
{
	connection.object.collection('users').insertOne(
	{
		"emailId":emailId,
		"password":"test",
		"keys":[]
	},function(err, result) 
	{
		if(err)
   		{
   			console.log("Error while getting count in Mongo DB: ")
            console.log(err);
   			callback({status:"error", message:"Mongo DB error while getting count."});
   		}
   		else
   		{
   			console.log("Inserted user " + emailId + " into the users collection.");
	    	   callback({status:"ok"});
   		}
	    
  	});
}

exports.updatePassword = function(emailId, newPassword, callback)
{
   connection.object.collection('users').updateOne(
      { "emailId" : emailId },
      {
        $set: {"password": newPassword}
      }, function(err, results) 
      {
         if(err)
         {
            console.log("error while updating password for user " + emailId);
            console.log(err);
            callback({status:"error"});
         }
         else
         {
            callback({status:"ok"});
         }
      });
}


exports.getCredentials = function(emailId, callback)
{
   var users = connection.object.collection('users').find();
   users.each(function(err, user) 
   {
      if (user != null) 
      {
         var credentials = {password:user.password, keys : user.keys};
         callback(credentials);
      } 
   });
}

exports.delete = function(emailId, callback)
{	
	connection.object.collection('users').deleteMany(
	{
	  "emailId":emailId
	},function(err, result) 
	{
		   if(err)
   		{
   			console.log("Error while deleting from Mongo DB:" + err);
   			callback({status:"error", message:"Mongo DB error while removing user."});
   		}
   		else
   		{
   			console.log("Deleted user " + emailId + " from the users collection.");
	    	   callback({status:"ok"});
   		}
  	});
}

exports.getAllEmails = function(callback)
{
   userEmails = [];
   var users = connection.object.collection('users').find();
   users.each(function(err, user) {
      if(err)
      {
         console.log("Error while deleting from Mongo DB:" + err);
         callback({status:"error", message:"Mongo DB error while getting all users."});
      }
      if(user != null) 
      {
         userEmails.push(user.emailId);
      } 
      else
      {
         callback({status:"ok"}, userEmails);      
      }
   });
   //console.log(users);
}