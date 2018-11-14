'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const mongoose = require('mongoose');
// require('dotenv').config();

const actions = require('./actions');
const BOT = require('./bot');

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// configure app
app.set('view engine', 'ejs');


let i = 0; // actions counter
let registration_process_started = false;
const user = [];
const source = {};

// mongoose db connection
mongoose.connect(`mongodb://${process.env.USERNAME}:${process.env.PASSWORD}@ds239682.mlab.com:39682/testreg`);

const User = mongoose.model('User', {
  name: String,
  university: String,
  graduation_date: String,
  email: String,
  phone: String,
  attend_date: String,
  confirmed: { type: Boolean, default: false },
  hidden: { type: Boolean, default: false }
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

// event handler
function handleEvent(event) {

  console.log(event);
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  if (source[event.source.userId] === undefined) {
    source[event.source.userId] = new BOT(event.source.userId);
  }

    if (event.message.text.trim() === "エントリー") {
      source[event.source.userId].start();
    }
    // registration process started
    if (source[event.source.userId].registration) {
      // did we ask all the questions?
      if (source[event.source.userId].i === actions.length) {
        if (event.source.userId === source[event.source.userId].id)
          source[event.source.userId].answers.push(event.message.text);
        console.log(source[event.source.userId].answers);

        source[event.source.userId].info = new User();
        source[event.source.userId].info.name = source[event.source.userId].answers[1];
        source[event.source.userId].info.university = source[event.source.userId].answers[2];
        source[event.source.userId].info.graduation_date = source[event.source.userId].answers[3];
        source[event.source.userId].info.email = source[event.source.userId].answers[4];
        source[event.source.userId].info.phone = source[event.source.userId].answers[5];
        source[event.source.userId].info.attend_date = source[event.source.userId].answers[7];
        source[event.source.userId].info.save().then(response => {
          client.pushMessage(event.source.userId, { "type": "text", "text": "以上で終わりです！今後の流れは後ほど担当よりご連絡させていただきます。ご協力ありがとうございました。" })
            .then(() => {
              console.log('done');
              source[event.source.userId].reset(); // reset the user info array
            })
            .catch((err) => {
              // error handling
              console.log(err);
            });
          // reset everything
          source[event.source.userId].reset();
          // console.log(user);
          // user.length = 0;
        })
          .catch(error => {
            client.pushMessage(event.source.userId, { "type": "text", "text": "error saving, do the registration again" })
              .then(() => {
                console.log('done');
                source[event.source.userId].reset(); // reset the user info array
              })
              .catch((err) => {
                // error handling
                console.log(err);
              });
          });

        return;
      }

      const message = actions[source[event.source.userId].i];

      client.pushMessage(event.source.userId, message)
        .then(() => {
          source[event.source.userId].answers.push(event.message.text);
          source[event.source.userId].inc();
          console.log(source[event.source.userId].i);
        })
        .catch((err) => {
          // error handling
          console.log(err);
        });
      return;
    }

  
    return client.replyMessage(event.replyToken, { "type": "text", "text": "「エントリー」と送信してください" });
    
  }

  // listen on port
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`listening on ${port}`);
  });