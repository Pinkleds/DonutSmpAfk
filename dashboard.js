const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { startBot } = require('./bot');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', socket => {
  console.log('🌐 Web client connected');
});

startBot(io);

server.listen(3000, () => {
  console.log('🌍 Dashboard live at http://localhost:3000');
});