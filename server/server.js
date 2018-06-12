const express = require('express');
const cors = require('cors');
const apiRoutes = require('./controllers/routes/api-routes');

// const authRoutes = require('./routes/auth-routes');
// const isLoggedIn = require('./controllers/isLoggedIn');

const corsOptions = {
  origin: '*',
  credentials: true,
};

const server = express();

server.use(cors(corsOptions));

server.use('/api', /* isLoggedIn,*/ apiRoutes);

// server.use('/', authRoutes);

module.exports = server;
