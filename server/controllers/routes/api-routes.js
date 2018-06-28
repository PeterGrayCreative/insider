const express = require('express');
const Twilio = require('twilio');
const morgan = require('morgan');
// const config = require('../../config.js');

const server = express();
server.use(morgan('combined'));

server.use(express.json());

const STATUS_SUCCESS = 200;
const SERVER_ERROR = 500;

const { stripeAuth, sendSMS } = require('../../models/models');

// const User = require('../models/user-model');
// const Message = require('../models/message-model');

// Stripe POST api call
server.post('/send', (req, res) => {
  const { token } = req.body;
  const { message, recipient } = req.body;

  stripeAuth(token)
    .then((stripeData) => {
      if (stripeData.statusCode > 204) {
        res
          .status(stripeData.statusCode)
          .json({ error: stripeData.message });
      }
      sendSMS(message, recipient).then((data) => {
        if (data.status > 204) {
          res
            .status(data.status)
            .json({ error: data.message });
        } else {
          res
            .status(200)
            .json({ success: 'Your message was successfully sent.' });
        }
      });
    }).catch(error => res.status(SERVER_ERROR).json({ error }));
});

// Twilio GET api call (10 last messages)
server.get('/recent-messages', (req, res) => {
  const { TWILIO_TOKEN, TWILIO_SID } = process.env;
  const client = new Twilio(TWILIO_SID, TWILIO_TOKEN);
  const limit = 10;
  const arr = [];
  client.messages.each({ limit }, (msg) => {
    const { dateCreated, body, sid } = msg;
    const message = {
      body,
      dateCreated,
      sid,
    }
    arr.push(message);
    if (arr.length === limit) res.status(STATUS_SUCCESS).json(arr);
  });
});

module.exports = server;
