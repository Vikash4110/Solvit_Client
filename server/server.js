// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDb = require('./utils/db');
const counselorRouter = require("./router/counselor-router");
const adminRouter = require("./router/admin-router");
const clientRouter = require("./router/client-router");
const { errorMiddleware } = require("./middlewares/counselor-middleware");

const Port = process.env.PORT || 8000;
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Routes
// app.use('/api/counselors', counselorRouter)
// Routes (no express.json() or body-parser here, let multer handle it)
app.use("/api/counselors", counselorRouter);;
app.use("/api/admin", adminRouter);
app.use("/api/clients", clientRouter);
// Global Error Handler
app.use(errorMiddleware);

connectDb()
  .then(() => {
    app.listen(Port, () => {
      console.log(`Server is running on port ${Port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
  });