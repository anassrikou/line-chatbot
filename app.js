'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const mongoose = require('mongoose');
// const validator = require("email-validator");
const GoogleSpreadsheet = require('google-spreadsheet');
// require('dotenv').config();

const actions = require('./actions');
const BOT = require('./bot');
const User = require('./models/users');

var creds = require('./credentials.json');

// Create a document object using the ID of the spreadsheet - obtained from its URL.
var doc = new GoogleSpreadsheet('1lq3e2k78JfMC3XBpedUlZsW4AzVKGXymHACUxXKrHas');

// Authenticate with the Google Spreadsheets API.
doc.useServiceAccountAuth(creds, function (err) {

  // Get all of the rows from the spreadsheet.
  doc.getRows(1, function (err, rows) {
    console.log('rows: ', rows);
  });
});

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// configure app
app.set('view engine', 'ejs');

const source = {};
const keys = ["name", "university", "graduation_date", "email", "phone", "attend_date", "confirm"];

// mongoose db connection
mongoose.connect(`mongodb://${process.env.USERNAME}:${process.env.PASSWORD}@ds157843.mlab.com:57843/event`, { useNewUrlParser: true });

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

app.get('/registrations', (req, res) => {
  User.find().then(response => {
    return res.render('event', { users: response });
  }).catch(error => res.json(error));
});

app.post('/confirm/:id', (req, res) => {
  const id = req.params.id;
  User.findByIdAndUpdate(id, { $set: { confirmed: true } }, { new: true })
    .then(user => res.json(user))
    .catch(error => res.json(error));
});

app.post('/hide/:id', (req, res) => {
  const id = req.params.id;
  User.findByIdAndUpdate(id, { $set: { hidden: true } }, { new: true })
    .then(user => res.json(user))
    .catch(error => res.json(error));
})

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/webhook', line.middleware(config), (req, res) => {
  // when the hook is called we start doing stuff
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// event handler
function handleEvent(event) {

  const userId = event.source.userId;

  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  //get the user message
  console.log('user msg',event.message.text);
  
  const user_input = event.message.text;
  
  // new user adding the bot to chat list will get added to the source list with an instance of bot for him
  if (source[userId] === undefined) {
    source[userId] = new BOT(userId);
  }

  if (source[userId].info === null)
    source[userId].info = new User();
  
  console.log('current i', source[userId].index);

  if (event.message.text.trim() === "エントリー") {
    source[userId].startRegistrationProcess();
  }
  // registration process ended or not started
  if (!source[userId].registration) {
    return client.replyMessage(event.replyToken, { "type": "text", "text": "「エントリー」と送信してください" });
  }

  // here we process the user input and add their response to our database
  let index = source[userId].index;

  // if (keys[index-1] === 'no') { // user wants to add another date
  //   user[userId].backToAttendDate();
  // }
  
  if (keys[index] === undefined) {
    // no more questions to ask 
    console.log('no more questions')
    source[userId].reset();
    return client.replyMessage(event.replyToken, { "type": "text", "text": "以上で終わりです！今後の流れは後ほど担当よりご連絡させていただきます。ご協力ありがとうございました。" });
  }


  source[userId].info[keys[index-1]] = user_input;
  console.log('user info', source[userId].info);
  User.findOneAndUpdate({ lineId: userId }, source[userId].info, { new: true, upsert: true })
    .then((result) => {
      console.log('result', result);
    })
    .catch(error => {
      console.log(error);
    });

  // registration logic here
  const message = actions[keys[index]];

  client.pushMessage(userId, message)
    .then(() => {
      source[userId].answers.push(event.message.text);
      source[userId].nextQuestion();
    })
    .catch((err) => {
      // error handling
      console.log(err);
    });
  return;

}

// listen on port
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});