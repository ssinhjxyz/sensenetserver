var google = require('googleapis');
var CALENDAR = require('./calendars');
var authToken - require('./authToken');

exports.createEvents = function (ids, emailId, startDateTime, endDateTime){
  
  var numIds = ids.length;
  for(var i = 0; i < numIds; i++)
  { 
    var calendarId = CALENDAR.IDS[ids[i]];
    if(calendarId)
    {
      console.log("creating event for bbb " + ids[i]);
      createGCalEvent( ids[i], calendarId, emailId, startDateTime, endDateTime);
    }
  }
}


var createEvent = function( bbbId, calendarId, emailId, startDateTime, endDateTime){

  var calendar = google.calendar('v3');
  var attendees = [{'email':emailId}];

  var event = {
    'summary': "Sensenet Reservation",
    'location': "BBB " + bbbId,
    'description': 'Reservation for a BBB',
    'start': {
      'dateTime': startDateTime,
      'timeZone': 'Etc/UTC',
    },
    'end': {
      'dateTime': endDateTime,
      'timeZone': 'Etc/UTC',
    },
    'attendees': attendees,
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10},
      ],
    },
  };

calendar.events.insert({
  auth: globalAuth,
  calendarId: calendarId,
  sendNotifications:true,
  resource: event,
}, function(err, event) {
  if (err) {
    console.log('There was an error contacting the Calendar service: ' + err);
    return;
  }
  console.log('Event created with ' + attendees[0].email);
  console.log('Start : ' + startDateTime + ' | End : ' + endDateTime);
  
});}

/**
 * Validate the event : requested event should not overlap with an existing event
 *
 */
exports.validateEvent = function(startTime, endTime, callback) 
{
  var calendar = google.calendar('v3');
  calendar.events.list(
  {
    auth: authToken.token,
    calendarId: 'primary',
    timeMin: startTime,
    timeMax: endTime,
    maxResults: 1,
    singleEvents: true,
    orderBy: 'startTime'
  }, 
  function(err, response) 
  {
    if (err)
    {
      console.log('The API returned an error: ' + err);
      return;
    }
    if (response.items.length > 0) 
    {
      callback(false);
    } 
    else
    {
      callback(true);
    }
  });
}
