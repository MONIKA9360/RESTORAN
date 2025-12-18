const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Make supabase available to routes
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// Import routes
const menuRoutes = require('../server/routes/menu');
const bookingsRoutes = require('../server/routes/bookings');
const authRoutes = require('../server/routes/auth');
const contactRoutes = require('../server/routes/contact');
const tablesRoutes = require('../server/routes/tables');
const ordersRoutes = require('../server/routes/orders');

// Routes
app.use('/menu', menuRoutes);
app.use('/bookings', bookingsRoutes);
app.use('/auth', authRoutes);
app.use('/contact', contactRoutes);
app.use('/tables', tablesRoutes);
app.use('/orders', ordersRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    supabase_url: process.env.SUPABASE_URL ? 'Connected' : 'Missing',
    message: 'Backend API is running successfully!'
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend API is working!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;