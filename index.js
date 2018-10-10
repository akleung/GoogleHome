/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const functions = require('firebase-functions');
const {google} = require('googleapis');
const {WebhookClient} = require('dialogflow-fulfillment');

// Enter your calendar ID and service account JSON below.
const calendarId = 'ok9dqonk3sim2p9qjjpv63ngkc@group.calendar.google.com'; // Example: 6ujc6j6rgfk02cp02vg6h38cs0@group.calendar.google.com
const serviceAccount = {
  "type": "service_account",
  "project_id": "testprojectv2-1537544416855",
  "private_key_id": "c23cd527e6fc0d506f701351c957dae935627a08",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCaWs+AIJPkGZYZ\n4G3qbZod2ghGCPScFVHT4qtn+4nSOh2KtfJgx32+b8VYGCFj8soC3FWO7dcTmVZb\nTDSfghLbAmDUD00n+X8oUXYNVId4pI78L4e8kOhchRnW1gSDYEKT5Id6XvHRjYFk\nW1J5X9v9eYMghlqJ3HSgZoVRnhZIzXOyk1TMctdu73qoM0haj9nwesyBPzpxpAiz\nn0zxAgDxU61cskhRf/5L5gx1VDlKLLF6YtPpCONjzEmYarCrxipJRg7jnAnEJVOF\n4e312tqkBr5oCl1cyirW/WEWxXaepl9RqU5x35iuEDuAxk326oyGFog7jyDwha9W\nx19qrF3tAgMBAAECggEAAII8HNf+pMnQzNUIh7VExMRrMo/k/n6zfldI6VbS5XZ7\nknF3EwqVR4NmyxuJQKMUN14yif4Or2nZ9wMRSVVMapxfZVOHlZIk8SUTloeoyqUA\nM6SUdfKkUWm+5A5ghW5Tydj++VBGy8IDoykJ5IyEVRmJbRoEQmAPole0KMi0mhjR\n8VeteJKoNn8Kexw/l556ok1V15tvDZb9KyqGb1v7X5/60vaRPOSIr59bUDpPSG0b\nXTh1mE6KTbRTdX8A2RCUyiFK6ywd/icV8IIflVYKgMd5kR3/duJWs0o9lISNtB+F\ndvTqYGExwZRsxNmPoplm6Yq3zVV9KgJu3gimwOubAQKBgQDIWllhp6LRFNbH98im\n3xvKZ9ELIJ0YyMfl1ZQKa2ZrnTJb/9fPoqhId8mLjCY96UrIp4861Yx8jIvq0jFh\nX+y8Yx7oJHumRRWlKSopkgJTqB+ea1pcn2STcgE0sWM/SpjUNML4ULHUAaVwmLUh\n4+40r6kIKUapKTW+1c6o7h6niQKBgQDFOdyKjPUE/CqAu2dtfb0+A/VvqvkNe8Xn\nbKEQ4Y7c59wLgSFYI0LgT1HpsxuZUjLAI6DaidgfcJRTIh7T9NJ9pg40au+Zse5i\n/dQaXS4NH3wMUoljQAAobVn0+o79ozGWZe485A7K3fr4zZoULjNwywOcdE79HR9+\nLDVoxZwGRQKBgQCtccHVD4mdFTxGytRS2ey2EZ/f0TEOxqp+5qGNT6LP4Ls698Y9\ngyPJ8KFzBDYK/M533M7a8Qn4vLdX5vVGxgMsp2aXMxY0P7RYUcWlTThkcbRFscv9\nSSOJnXU7x6ESpqKderuaukjoLzCoxBpyp16ND9D2Nr1sLjfP6EpK5jF1eQKBgQCg\n7USR3NA0gBmiLsgG5Dlc99f1hPlw0hS6b73Ay3tJrvqyfGwbwbHY24AIA7g6U4LL\nmoauqxkpFjBA4S9sXXC/S5Z9mN/mdfQA3AKMfImN9am/WD14OYmncwqaxTOVq+pT\nQNqy3pdfWt9k0katvsEEgPJyX8jv6SqARkxSMCPOTQKBgCgIzZGHvrFzLDtyCZOk\nEQNCNziO0/L6CWpxLeBlciAkMlG6IX2uWYHOPcPpKm7tW/mdat+bRgVxDSvv/uJ1\n8BXejd5ZPp+nOl8km6lwcXpKHsUmxYeFkFh6ZyGTUGRE1cZQl+yzvQNniE3znUk7\nbRRH1pQHdfcgLDFD28SlKQbX\n-----END PRIVATE KEY-----\n",
  "client_email": "book-room-calendar@testprojectv2-1537544416855.iam.gserviceaccount.com",
  "client_id": "116933136544266212772",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/book-room-calendar%40testprojectv2-1537544416855.iam.gserviceaccount.com"
}; // The JSON object looks like: { "type": "service_account", ... }

// Set up Google Calendar service account credentials
const serviceAccountAuth = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: 'https://www.googleapis.com/auth/calendar'
});

const calendar = google.calendar('v3');
process.env.DEBUG = 'dialogflow:*'; // It enables lib debugging statements

const timeZone = 'America/Toronto';  // Change it to your time zone
const timeZoneOffset = '-04:00';     // Change it to your time zone offset

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });

  function makeAppointment (agent) {
    agent.add(`October ten twenty eighteen`);
    // Use the Dialogflow's date and time parameters to create Javascript Date instances, 'dateTimeStart' and 'dateTimeEnd',
    // which are used to specify the appointment's time.
    // const appointmentDuration = agent.parameters.duration;// Define the length of the appointment to be one hour.
    const appointmentDuration = 1;// Define the length of the appointment to be one hour.
    const dateTimeStart = convertParametersDate(agent.parameters.date, agent.parameters.time);
    const dateTimeEnd = addHours(dateTimeStart, appointmentDuration);
    const appointmentTimeString = getLocaleTimeString(dateTimeStart);
    const appointmentDateString = getLocaleDateString(dateTimeStart);
    // Check the availability of the time slot and set up an appointment if the time slot is available on the calendar
    return createCalendarEvent(dateTimeStart, dateTimeEnd).then(() => {
    const num = getRandomInt(1,5);
    if (num == 1){
        agent.add(`Got it. I have your meeting scheduled on ${appointmentDateString} at ${appointmentTimeString} in your calendar.`);
    }
    if (num == 2){
        agent.add(`OK, let me schedule your meeting on ${appointmentDateString} at ${appointmentTimeString} in your calendar.`);
    }
    if (num == 3){
        agent.add(`Let me get your meeting on ${appointmentDateString} at ${appointmentTimeString} scheduled in your calendar.`);
    }
    if (num == 4){
        agent.add(`You're all set for your meeting on ${appointmentDateString} at ${appointmentTimeString}. You can find the booking in your calendar.`);
    }
    if (num == 5){
        agent.add(`I've scheduled your booking on ${appointmentDateString} at ${appointmentTimeString} in your calendar.`);
    }
      //agent.add(`Got it. I have your meeting scheduled on ${appointmentDateString} at ${appointmentTimeString}.`);
    }).catch(() => {
      agent.add(`Sorry, we're booked on ${appointmentDateString} at ${appointmentTimeString}. Is there anything else I can do for you?`);
    });
  }
  let intentMap = new Map();
  intentMap.set('room_booking', makeAppointment);  // It maps the intent 'Make Appointment' to the function 'makeAppointment()'
  agent.handleRequest(intentMap);
});

function createCalendarEvent (dateTimeStart, dateTimeEnd) {
  return new Promise((resolve, reject) => {
    calendar.events.list({  // List all events in the specified time period
      auth: serviceAccountAuth,
      calendarId: calendarId,
      timeMin: dateTimeStart.toISOString(),
      timeMax: dateTimeEnd.toISOString()
    }, (err, calendarResponse) => {
      // Check if there exists any event on the calendar given the specified the time period
      if (err || calendarResponse.data.items.length > 0) {
        reject(err || new Error('Requested time conflicts with another appointment'));
      } else {
        // Create an event for the requested time period
        calendar.events.insert({ auth: serviceAccountAuth,
          calendarId: calendarId,
          resource: {summary: 'Meeting Room Booking',
            start: {dateTime: dateTimeStart},
            end: {dateTime: dateTimeEnd}}
        }, (err, event) => {
          err ? reject(err) : resolve(event);
        }
        );
      }
    });
  });
}

// A helper function that receives Dialogflow's 'date' and 'time' parameters and creates a Date instance.
function convertParametersDate(date, time){
  return new Date(Date.parse(date.split('T')[0] + 'T' + time.split('T')[1].split('-')[0] + timeZoneOffset));
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// A helper function that adds the integer value of 'hoursToAdd' to the Date instance 'dateObj' and returns a new Data instance.
function addHours(dateObj, hoursToAdd){
  return new Date(new Date(dateObj).setHours(dateObj.getHours() + hoursToAdd));
}

// A helper function that converts the Date instance 'dateObj' into a string that represents this time in English.
function getLocaleTimeString(dateObj){
  return dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, timeZone: timeZone });
}

// A helper function that converts the Date instance 'dateObj' into a string that represents this date in English. 
function getLocaleDateString(dateObj){
  return dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: timeZone });
}
