const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const conn_str = process.env.MONGODB_URI || 'mongodb://heroku_663tp2s4:4gnldjdnluumd8bvb2825cokm9@ds121341.mlab.com:21341/heroku_663tp2s4';

const app = express();

// API ROUTES
const public = require('./routes/public');
const private = require('./routes/private');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '../dist/catalk')));

app.use('/api', public);
app.use('/private', private);
// app.use(cors());
// app.use(forceSSL());

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/catalk/index.html'));
});

const port = process.env.PORT || '9001';
app.set('port', port);

mongoose.connect(conn_str);

const server = http.createServer(app);

server.listen(port, () => console.log(`Magic happens on port:${port}`));
