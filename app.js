'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const mongoose = require('mongoose');
// require('dotenv').config();

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
  

  if (event.message.text.trim() === "エントリー")
    registration_process_started = true;
  else
    return client.replyMessage(event.replyToken, { "type": "text", "text": "「エントリー」と送信してください" });

  // registration process started
  if (registration_process_started) {
    // did we ask all the questions?
    if (i === actions.length) {
      user.push(event.message.text);
      console.log(user);

      const info = new User();
      info.name = user[1];
      info.university = user[2];
      info.graduation_date = user[3];
      info.email = user[4];
      info.phone = user[5];
      info.attend_date = user[7];
      info.save().then(response => {
        client.pushMessage(event.source.userId, { "type": "text", "text": "以上で終わりです！今後の流れは後ほど担当よりご連絡させていただきます。ご協力ありがとうございました。" })
          .then(() => {
            console.log('done');
            user.length = 0; // reset the user info array
          })
          .catch((err) => {
            // error handling
            console.log(err);
          });
        // reset everything
        i = 0;
        console.log(user);
        registration_process_started = false; // end registration
        // user.length = 0;
      })
        .catch(error => {
          console.log(error);
        });

      return;
    }

    const message = actions[i];

    client.pushMessage(event.source.userId, message)
      .then(() => {
        user.push(event.message.text);
        i++;
        console.log('next question: ', i == actions.length ? 'no more' : actions[i]);
      })
      .catch((err) => {
        // error handling
        console.log(err);
      });
    return;
  }

  //   // check if we asked all the questions
  //   if (i === actions.length) {
  //     // we get the last message here
  //     user.push(event.message.text);

  //    }

  //   if (registration_process_started) {
  //     // increment the counter
  //     if (event.message.text !== "register" || event.message.text !== "同意する") {
  //       // add date to user table so we can send it later to database
  //       user.push(event.message.text);
  //     }

  //     const reply = actions[i];

  //     console.log(i, actions.length, user);
  //     i++;
  //     return client.replyMessage(event.replyToken, reply);
  //   }

  //   // use reply API
  //   
}

// listen on port
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});