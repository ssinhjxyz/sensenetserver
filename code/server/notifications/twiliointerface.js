//Initialize a REST client in a single line:
var client = require('twilio')('AC62494497fe1eb943d38d4b28adbbf7e3', '5c8611282033e96d4c62c4e14192bad7');
var schedule = require('node-schedule');
 
// Use this convenient shorthand to send an SMS:
exports.sendSms = function(cellphoneNumber, start, end)
{ 
    var notificationDateTime = new Date(end);
    notificationDateTime.setTime(notificationDateTime.getTime() - 1000*5*60);
    schedule.scheduleJob(notificationDateTime, 
                      function()
                      {
                        sendReservationEndNotification(cellphoneNumber);
                      });

    sendReservationStartNotification(cellphoneNumber);
}

sendReservationStartNotification = function(cellphoneNumber)
{   
    send(cellphoneNumber, "Your sensenet reservation starts in 5 min. Plz check email 4 details")
}


sendReservationEndNotification = function(cellphoneNumber)
{   
    send(cellphoneNumber, "Your sensenet reservation ends in 5 min.")
}

send = function(cellphoneNumber, message)
{
    client.sendSms(
    {
        to:cellphoneNumber,
        from:'+19193361027',
        body:message
    }, function(error, message) {
        if (!error) {
            console.log('Success! The SID for this SMS message is:');
            console.log(message.sid);
            console.log('Message sent on:');
            console.log(message.dateCreated);
        } else {
            console.log('Oops! There was an error.');
            console.log(error);
        }
    });
}