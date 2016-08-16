var connection = require('../database/connection');

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
		"rsaKeys":[]
	},function(err, result) 
	{
		if(err)
   		{
   			console.log("Error while getting count in Mongo DB: " + err);
   			callback({status:"error", message:"Mongo DB error while getting count."});
   		}
   		else
   		{
   			console.log("Inserted user " + emailId + " into the users collection.");
	    	   callback({status:"ok"});
   		}
	    
  	});
}

exports.updatePassword = function(emailId, callback, newPassword)
{
   connection.object.collection('users').updateOne(
      { "emailId" : emailId },
      {
        $set: {"password": newPassword}
      }, function(err, results) 
      {
         console.log(results);
         callback();
      });
}


exports.getPassword = function(emailId, callback)
{
   var users = connection.object.collection('users').find();

   users.each(function(err, user) 
   {
      if (user != null) 
      {
         callback(user.password);
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
