// // server.js
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const connectDb = require('./utils/db');
// const counselorRouter = require("./router/counselor-router");
// const adminRouter = require("./router/admin-router");
// const clientRouter = require("./router/client-router");
// const { errorMiddleware } = require("./middlewares/counselor-middleware");

// const Port = process.env.PORT || 8000;
// const app = express();

// app.use(cors({
//   origin: ['http://localhost:5173',"https://solvit-client.vercel.app"],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

// app.use(express.json());

// // Routes
// // app.use('/api/counselors', counselorRouter)
// // Routes (no express.json() or body-parser here, let multer handle it)
// app.use("/api/counselors", counselorRouter);;
// app.use("/api/admin", adminRouter);
// app.use("/api/clients", clientRouter);
// // Global Error Handler
// app.use(errorMiddleware);

// connectDb()
//   .then(() => {
//     app.listen(Port, () => {
//       console.log(`Server is running on port ${Port}`);
//     });
//   })
//   .catch((error) => {
//     console.error('Failed to connect to database:', error);
//   });

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDb = require('./utils/db');
const counselorRouter = require("./router/counselor-router");
const adminRouter = require("./router/admin-router");
const clientRouter = require("./router/client-router");
const messageRouter = require('./router/message-router');
const { errorMiddleware } = require("./middlewares/counselor-middleware");
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/message-model'); // New Message model

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://solvit-client.vercel.app'],
    methods: ['GET', 'POST'],
  },
});

app.use(cors({
  origin: ['http://localhost:5173', 'https://solvit-client.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Pass Socket.IO instance to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', (userId) => {
    if (userId) {
      socket.join(userId);
      io.emit('userStatus', { userId, isOnline: true });
      console.log(`User ${userId} joined room: ${userId}`);
    }
  });

  socket.on('sendMessage', async (messageData) => {
    const { senderId, receiverId, status } = messageData;
    console.log('Received message data:', messageData);

    if (!senderId || !receiverId) {
      console.error('Invalid message data');
      return;
    }

    const receiverSockets = await io.in(receiverId).fetchSockets();
    if (receiverSockets.length > 0) {
      messageData.status = 'delivered';
      io.to(receiverId).emit('receiveMessage', messageData);
      io.to(senderId).emit('messageStatusUpdate', { messageId: messageData._id, status: 'delivered' });
    }
  });

  socket.on('messageSeen', async ({ messageId, receiverId }) => {
    try {
      const message = await Message.findByIdAndUpdate(messageId, { status: 'seen' }, { new: true });
      io.to(receiverId).emit('messageStatusUpdate', { messageId, status: 'seen' });
      io.to(message.senderId).emit('messageStatusUpdate', { messageId, status: 'seen' });
    } catch (err) {
      console.error('Error updating message status:', err);
    }
  });

  socket.on('messageDeleted', ({ messageId, receiverId }) => {
    io.to(receiverId).emit('messageDeleted', { messageId });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    const userId = Object.keys(socket.rooms).find((room) => room !== socket.id);
    if (userId) {
      io.emit('userStatus', { userId, isOnline: false });
    }
  });
});

// Routes
app.use('/api/counselors', counselorRouter);
app.use('/api/admin', adminRouter);
app.use('/api/clients', clientRouter);
app.use('/api/messages', messageRouter); 

// Global Error Handler
app.use(errorMiddleware);

const Port = process.env.PORT || 8000;

connectDb()
  .then(() => {
    server.listen(Port, () => {
      console.log(`Server is running on port ${Port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
  });