'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const mongoose = require('mongoose');
// require('dotenv').config();

const actions = require('./actions');
const BOT = require('./bot');
const User = require('./models/users');

// var creds = require('./client_secret.json');

// Create a document object using the ID of the spreadsheet - obtained from its URL.

// Authenticate with the Google Spreadsheets API.


// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// configure app
app.set('view engine', 'ejs');

const source = {};
const keys = ["name", "university", "graduation_date", "email", "phone", "attend_date", "confirm"];

// mongoose db connection
mongoose.connect(`mongodb://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.DB_URL}`, { useNewUrlParser: true });
// mongodb://<dbuser>:<dbpassword>@ds157843.mlab.com:57843/event
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

function resetQuestions(event) {
  console.log('no more questions')
    source[event.source.userId].reset();
    return client.replyMessage(event.replyToken, { "type": "text", "text": "以上で終わりです！今後の流れは後ほど担当よりご連絡させていただきます。ご協力ありがとうございました。" });
}

// event handler
function handleEvent(event) {

  console.log('\n --------------------- \n event data \n ', event, '\n ------------------------- \n');

  const userId = event.source.userId;

  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  //get the user message  
  const user_input = event.message.text;
  
  // new user adding the bot to chat list will get added to the source list with an instance of bot for him
  if (source[userId] === undefined) {
    source[userId] = new BOT(userId);
  }

  // first time users will get a new instance of the user model
  if (source[userId].info === null) {
    source[userId].info = new User();
  }
  
  console.log('current i and key', source[userId].index, keys[source[userId].index]);

  if (event.message.text.trim() === "エントリー") {
    source[userId].startRegistrationProcess();
    return client.replyMessage(event.replyToken, {
      "type": "text",
      "text": "まずはじめにお名前を教えて下さい"
    });
  }
  // registration process ended or not started
  if (!source[userId].registration) {
    return client.replyMessage(event.replyToken, { "type": "text", "text": "「エントリー」と送信してください" });
  }

  if (keys[source[userId].index] === undefined) {
    // no more questions to ask 
    resetQuestions(event);
  }
  const key = keys[source[userId].index];
  const update = {}; 
  update[key] = user_input;
  console.log('update field', update);
  source[userId].answers[key] = user_input;

  if (source[userId].has_multiple_events) {
    if (user_input === "はい") { // user doesnt wants to add another event date
      return resetQuestions(event);
    }
    else if (user_input === "いいえ") { // user wants to add another event date
      source[userId].backToAttendDate();
      const message = actions[keys[source[userId].index]];
      return client.replyMessage(event.replyToken, message);
    }
    else {
      if (keys[source[userId].index] === "attend_date") {
        console.log('reached attend date');
        
        User.findOneAndUpdate({ lineId: userId }, { $push: {'attend_date': user_input }})
        .then(result => console.log('result of save date', result))
        .catch(error => console.log(error));
        source[userId].nextQuestion();
        const message = actions[keys[source[userId].index]];
        if (!message)
        return resetQuestions(event);
        
        return client.replyMessage(event.replyToken, message); 
      }
    }
  } else {

    if (user_input === "いいえ") { // user wants to add another event date
      source[userId].backToAttendDate();
      const message = actions[keys[source[userId].index]];
      return client.replyMessage(event.replyToken, message);
    }
  
   
  
    User.findOneAndUpdate({ lineId: userId }, update, { new: true, upsert: true })
      .then((result) => {
        console.log('---------------------------')
        console.log('result', result);
         // registration logic here
         console.log('current key ', keys[source[userId].index]);
         source[userId].nextQuestion();
         const message = actions[keys[source[userId].index]];
         if (!message)
          return resetQuestions(event);
  
        return client.replyMessage(event.replyToken, message);
        
      })
      .catch(error => {
        console.log(error);
      });
  
  }
  

}

// listen on port
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});