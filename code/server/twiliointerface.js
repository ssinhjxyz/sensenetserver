//Initialize a REST client in a single line:
var client = require('twilio')('AC62494497fe1eb943d38d4b28adbbf7e3', '5c8611282033e96d4c62c4e14192bad7');
 
// Use this convenient shorthand to send an SMS:
exports.sendSms = function()
{
    client.sendSms(
    {
        to:'+19193481309',
        from:'+12018993318',
        body:'Reservation succeded !'
    }, function(error, message) {
        if (!error) {
            console.log('Success! The SID for this SMS message is:');
            console.log(message.sid);
            console.log('Message sent on:');
            console.log(message.dateCreated);
        } else {
            console.log('Oops! There was an error.');
        }
    });
}