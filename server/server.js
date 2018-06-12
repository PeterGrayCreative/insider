require('dotenv').config();
const express = require('express');
const twilio = require('twilio')
const server = express();
const router = express.Router();
const cors = require('cors');

server.use(cors())
server.use(express.json());
server.use(morgan('combined'));

const models = require('./models/models');

server.post('/api/send', (req, res) => {
  let SID = process.env.TWILIO_SID;
  let TOKEN = process.env.TWILIO_TOKEN;
  let FROM = process.env.TWILIO_FROM;

  if(!SID || !TOKEN) {
    return res.json({message: 'add TWILIO_SID and TWILIO_TOKEN to .env file.'})
  }

  const client = new twilio(SID, TOKEN)

  client.messages.create({
    to: req.body.recipient,
    from: FROM,
    body: req.body.message
  })
  .then((message) => console.log("Sent message: '" + message.body + "'"))
  .catch((err) => {
    res.send(err);
  })
})

server.listen(5000, () => console.log('App listening on port 5000!'));
module.exports = server;
