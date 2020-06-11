const express = require('express');
const exphbs = require('express-handlebars');
const path = require("path");
// const sio = require('socket.io')
const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded());

app.use(require('./routes/htmlRoutes'));
app.use(require('./routes/api'));

app.use(express.static(path.join(__dirname, 'public')));

// const io = sio.listen(
  app.listen(process.env.PORT || PORT, () => {
    console.log(`server running on ${process.env.PORT || PORT}`);
  // }));

// io.sockets.on('connection', function (socket) {
//   socket.on('username', function (username) {
//     socket.username = username;
//     io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
//   });

//   socket.on('disconnect', function (username) {
//     io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
//   })

//   socket.on('chat_message', function (message) {
//     io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
//   });
});