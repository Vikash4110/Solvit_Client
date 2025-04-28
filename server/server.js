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
const nodemailer = require('nodemailer');
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


// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Transporter verification failed:", error);
  } else {
    console.log("Transporter is ready to send messages");
  }
});
// Contact Form Route
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  // Server-side validation
  if (!name || !email || !message) {
    return res.status(400).json({ status: "error", message: "All fields are required" });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ status: "error", message: "Invalid email format" });
  }

  // Ensure RECEIVER_EMAIL is defined
  if (!process.env.RECEIVER_EMAIL) {
    console.error("RECEIVER_EMAIL is not defined in .env");
    return res.status(500).json({ status: "error", message: "Server configuration error" });
  }

  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    to: process.env.RECEIVER_EMAIL,
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #1a73e8;">New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p style="background: #f8f9fa; padding: 15px; border-radius: 4px;">${message}</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">This email was sent from your website's contact form.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ status: "success", message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ status: "error", message: "Failed to send email" });
  }
});

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