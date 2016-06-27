var google = require('googleapis');
var CALENDAR = require('./calendars');
var BBB = require('./bbbs');
var authToken = require('./authtoken');

exports.createEvents = function (ids, emailId, startDateTime, endDateTime){
  
  var numIds = ids.length;
  for(var i = 0; i < numIds; i++)
  { 
    var calendarId = CALENDAR.IDS[ids[i]];
    if(calendarId)
    {
      console.log("creating event for bbb " + ids[i]);
      createEvent( ids[i], calendarId, emailId, startDateTime, endDateTime);
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
  auth: authToken.token,
  calendarId: calendarId,
  sendNotifications:true,
  resource: event,
}, function(err, event) 
{
  if (err) 
  {
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
exports.validateTimings = function(results, startTime, endTime, callback) 
{
    new TimingsValidater(results, callback).validate(startTime, endTime);
}


function TimingsValidater(results, callback)
{
  this.results = results;
  this.callback = callback;
  this.numResponsesReceived = 0;
}

TimingsValidater.prototype.validate = function(startTime, endTime)
{
  var bbbIds = this.results[0];
  var numResponsesReceived = 0;
  var numBBBs = bbbIds.length;
  for(var i = 0; i < numBBBs; i++)
  {
     var bbbId = bbbIds[i];
     this.validateBBBCalendar(bbbId, startTime, endTime, numBBBs);  
  } 
}

TimingsValidater.prototype.validateBBBCalendar = function( bbbId, startTime, endTime, numBBBs)
{
    var that = this;
    var calendarId = CALENDAR.IDS[bbbId];
    var calendar = google.calendar('v3');
    calendar.events.list(
    {
      auth: authToken.token,
      calendarId: calendarId,
      timeMin: startTime,
      timeMax: endTime,
      maxResults: 1,
      singleEvents: true,
      orderBy: 'startTime'
    }, 
    function(err, response) 
    {
      that.numResponsesReceived++;
      if (err)
      {
        // To do : Remove from valid list.
        console.log('The API returned an error: ' + err);
      }
      else if (response.items.length > 0) 
      {
        // Remove entry from valid lists
        removeElemFromArray(that.results[1], BBB.Info[bbbId].Port);
        removeElemFromArray(that.results[0], bbbId);

        // Add entry to invalid list
        that.results[2].push({id:bbbId, message:"device is already booked in this duration."});

        // If responses for all BBBs have been received, call the callback.
        if(that.numResponsesReceived == numBBBs)
        {
          that.callback(that.results);
        }
      } 
      else 
      {
        // If responses for all BBBs have been received, call the callback.
        if(that.numResponsesReceived == numBBBs)
        {
          that.callback(that.results);
        }
      }
    });
}


function removeElemFromArray(array, element)
{
  // Remove entry from valid lists
  var index = array.indexOf(element);
  if(index !== -1)
  {
    array.splice(index, 1);
  }
}