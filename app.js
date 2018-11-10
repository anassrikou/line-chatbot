'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const mongoose = require('mongoose');

const actions = require('./actions');

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// configure app
app.set('view engine', 'ejs');


let i = 0; // actions counter
let registration_process_started = false;
const user = [];

// mongoose db connection
mongoose.connect(`mongodb://${process.env.USERNAME}:${process.env.PASSWORD}@ds157843.mlab.com:57843/event`);

const User = mongoose.model('User', { 
  name: String,
  university: String,
  graduation_date: String, 
  email: String,
  phone: String,
  attend_date: String
});

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

// event handler
function handleEvent(event) {
  console.log(event);
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }
  
  if (event.message.text.trim() === "エントリー")
    registration_process_started = true;

  // check if we asked all the questions
  if (i === actions.length) {
    // we get the last message here
    user.push(event.message.text);
   
    const info = new User();
    info.name = user[1];
    info.university = user[2];
    info.graduation_date = user[3];
    info.email = user[4];
    info.phone = user[5];
    info.attend_date = user[7];
    info.save().then(response => {
      // reset everything
      i = 0;
      registration_process_started = false; // end registration
      // user.length = 0;
      return client.replyMessage(event.replyToken, { "type": "text", "text": "以上で終わりです！今後の流れは後ほど担当よりご連絡させていただきます。ご協力ありがとうございました。" });
    })
    .catch(error => {
      return client.replyMessage(event.replyToken, {"type": "text", "text": "error saving"});
    });
   }

  if (registration_process_started) {
    // increment the counter
    if (event.message.text !== "register" || event.message.text !== "同意する") {
      // add date to user table so we can send it later to database
      user.push(event.message.text);
    }

    const reply = actions[i];

    console.log(i, actions.length, user);
    i++;
    return client.replyMessage(event.replyToken, reply);
  }
  
  // use reply API
  return client.replyMessage(event.replyToken, { "type": "text", "text": "「エントリー」と送信してください" });
}

// listen on port
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});