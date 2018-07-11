require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { server, io } = require('./server');
const { messagesFeed } = require('./models/models');
// Imports server.js and app.js creates a connection containing the routes and middleware

// Serve static files from the React app

io.sockets.on('connection', (socket) => {
  const sendMessages = () => {
    console.log('messages sent');
    fs.readFile(
      path.join(__dirname, './models/messages/messages.json'),
      'utf8',
      (err, data) => {
        if (err) socket.emit('socket-error', err);
        socket.emit('message-feed', data);
      },
    );
  };

  messagesFeed()
    .then(() => sendMessages())
    .catch((err) => {
      sendMessages();
      console.error(err);
    });
  fs.watch(path.join(__dirname, './models/messages/messages.json'), (event) => {
    if (event === 'change') sendMessages();
  });
});

const PORT = process.env.PORT || 3030;

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

module.exports = server;
