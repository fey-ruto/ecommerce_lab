// server/app.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const brandRoutes = require('./routes/brand');
const productRoutes = require('./routes/product');
const uploadRoutes = require('./routes/upload');

const app = express();

// ---- CORS: allow your deployed client + localhost for dev
const allowedOrigins = new Set([
  process.env.CLIENT_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
]);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow same-origin or tools (like curl) with no origin
      if (!origin || allowedOrigins.has(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

// static uploads (optional)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

// health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
