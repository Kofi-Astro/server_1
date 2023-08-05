require('dotenv').config();
const express = require("express");
const mongoDB = require('./database/index');
const socketIO = require('socket.io');
const shared = require('./shared');
const { use } = require('./routes');

const port = process.env.PORT || 5000;
// const port = 5000;

const app = express();

app.use(express.json());


const server = require('http').createServer(app);
const io = socketIO(server);
shared.io = io;

let users = [];
shared.users = users;

io.on('connection', socket => {
  socket.on('user-in', (user) => {
    // users.push({ ...user, socketId: socket.id });
    // io.emit('users-update', users);

    users.push({ ...user, socket });
    shared.users = users;
    // console.log('users now ', users);
  });


  socket.on('user-left', () => {
    users = users.filter(x => x.socketId !== socket.id);
    // io.emit('users-update', users);
    shared.users = users;
    // console.log('user left', users);
  });

  socket.on('disconnect', () => {
    users = users.filter(x => x.socketId !== socket.id);
    // io.emit('users-update', users);
    shared.users = users;
    // console.log('user disconnected', users);
  });
});

app.use('/', require('./routes'));




server.listen(port, () => {
  console.log("Server connected on port", port);
  mongoDB.connect();
});







































// const http = require("http");
// const mongoose = require('mongoose');
// const userRoutes = require('./routes/userRoutes');
// const messageRoutes = require('./routes/messagesRoutes');
// const bodyParser = require('body-parser');

// const app = express();
// const port = process.env.PORT || 5000;
// var server = http.createServer(app);
// var io = require("socket.io")(server);

// const mongodbUri = 'mongodb://localhost:27017/chatapp';
// const db = mongoose.connection;


// // Connect to MongoDB
// mongoose.connect(mongodbUri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// db.on('error', console.error.bind(console, 'MongoDB connection error: '));
// db.once('open', () => {
//   console.log('Connected to MongoDb');
// });

// // app.use(bodyParser.json());

// //middleware
// app.use(express.json());
// app.use(bodyParser.json());
// var clients = {};
// const routes = require('./routes');
// app.use('/routes', routes);
// app.use('/uploads', express.static('uploads'));


// // Routes
// app.use('/users', userRoutes);
// app.use('/messages', messageRoutes);


// // Socket.Io events for real-time messaging

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   //Example event: broadcast the message to all connected users
//   socket.on('send_message', (message) => {
//     io.emit('receive_message', message);
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected.');
//   });



// });



// io.on("connection", (socket) => {
//   console.log("connected");
//   console.log(socket.id, "has joined");
//   socket.on("signin", (id) => {
//     console.log(id);

//     clients[id] = socket.id;
//     console.log('clients:', clients);

//     socket.on('message', (msg) => {
//       console.log(msg);

//       let targetId = msg.targetId;

//       if (clients[targetId])
//         clients[targetId].emit('message', msg)
//     });
//   });
// });




















