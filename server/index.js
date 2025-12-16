const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
console.log('🔗 Supabase URL:', process.env.SUPABASE_URL ? 'Set' : 'Missing');
console.log('🔑 Supabase Key:', process.env.SUPABASE_ANON_KEY ? 'Set' : 'Missing');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const app = express();
const PORT = process.env.PORT || 5000;

// Make supabase available to routes
app.locals.supabase = supabase;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://restoran-rust.vercel.app', 'https://restoran-iota-coral.vercel.app'] 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api/menu', (req, res, next) => {
  req.supabase = supabase;
  next();
}, require('./routes/menu'));
app.use('/api/bookings', (req, res, next) => {
  req.supabase = supabase;
  next();
}, require('./routes/bookings'));
app.use('/api/auth', (req, res, next) => {
  req.supabase = supabase;
  next();
}, require('./routes/auth'));
app.use('/api/contact', (req, res, next) => {
  req.supabase = supabase;
  next();
}, require('./routes/contact'));
app.use('/api/tables', (req, res, next) => {
  req.supabase = supabase;
  next();
}, require('./routes/tables'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    supabase_url: process.env.SUPABASE_URL ? 'Connected' : 'Missing',
    email_config: process.env.EMAIL_USER ? 'Configured' : 'Missing',
    message: 'Backend is running successfully!'
  });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend API is working!',
    timestamp: new Date().toISOString()
  });
});

// Test booking endpoint (simple version)
app.post('/api/simple-booking', async (req, res) => {
  try {
    console.log('📝 Simple booking test received:', req.body);
    
    // Test database connection
    const { data, error } = await supabase
      .from('restaurant_tables')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Database error:', error);
      return res.status(500).json({
        success: false,
        error: 'Database connection failed',
        details: error.message
      });
    }
    
    res.json({
      success: true,
      message: 'Simple booking test successful!',
      database_status: 'Connected',
      tables_found: data ? data.length : 0,
      received_data: req.body
    });
    
  } catch (error) {
    console.error('❌ Simple booking error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test contact endpoint (simple version)
app.post('/api/simple-contact', async (req, res) => {
  try {
    console.log('📧 Simple contact test received:', req.body);
    
    res.json({
      success: true,
      message: 'Simple contact test successful!',
      received_data: req.body
    });
    
  } catch (error) {
    console.error('❌ Simple contact error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test booking endpoint
app.post('/api/test-booking', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working!',
    received_data: req.body,
    environment: process.env.NODE_ENV
  });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('restaurant_tables')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'Database connection working!',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Database connection failed'
    });
  }
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Supabase URL: ${process.env.SUPABASE_URL}`);
});

module.exports = { app, supabase };