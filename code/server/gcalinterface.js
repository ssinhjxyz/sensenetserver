var google = require('googleapis');
var BBB = require('./settings/bbbs');
var authToken = require('./authentication/authtoken');
var utils = require('./utils');

exports.createEvents = function (bbbIds, emailId, startDateTime, endDateTime){
  
  var numIds = bbbIds.length;
  var eventIds = [];
  for(var i = 0; i < numIds; i++)
  { 
    var calendarId = BBB.Info[bbbIds[i]].CalendarId;
    if(calendarId)
    {
      var eventId = utils.getUUID();
      eventIds.push(eventId);
      console.log("creating event for bbb " + bbbIds[i]);
      createEvent( bbbIds[i], calendarId, emailId, startDateTime, endDateTime, eventId);
    }
  }
  return eventIds;
}

exports.deleteEvent = function(eventId, calendarId, res)
{
  var calendar = google.calendar('v3');
  
  calendar.events.delete({
  auth: authToken.token,
  calendarId: calendarId,
  sendNotifications:true,
  eventId:eventId
  }, function(err, event) 
  {
    var response ={status:"ok"};
    if (err) 
    {
      console.log('There was an error contacting the Calendar service: ' + err);
      response.status = "error";
    }
    res.end(JSON.stringify(response));
  });
}

var createEvent = function( bbbId, calendarId, emailId, startDateTime, endDateTime, eventId){

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
    'id': eventId,
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
  resource: event
}, function(err, event) 
{
  if (err) 
  {
    console.log('There was an error contacting the Calendar service: ' + err);
    return;
  }
  console.log('Event created with ' + attendees[0].email);
  console.log('Start : ' + startDateTime + ' | End : ' + endDateTime); 
});
}

exports.checkIfEventExists = function(calendarId, eventId, callback)
{
  var calendar = google.calendar('v3');
    calendar.events.get(
    {
      auth: authToken.token,
      calendarId: calendarId,
      eventId: eventId
    }, 
    function(err, response) 
    {
      var exists = false;
      if(!err)
      {
        exists = response.status == "confirmed";
      }
      callback(exists);   
    });

}


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
  if(numBBBs == 0)
  {
    this.callback(this.results);
  } 
}

TimingsValidater.prototype.validateBBBCalendar = function( bbbId, startTime, endTime, numBBBs)
{
    var that = this;
    var calendarId = BBB.Info[bbbId].CalendarId;
    if(!calendarId)
    {
      this.numResponsesReceived++;
      this.results[2].push({id:bbbId, message:"device does not have a google calendar."});
      return;
    }
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
      //console.log( bbbId + " : " + response.items);
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