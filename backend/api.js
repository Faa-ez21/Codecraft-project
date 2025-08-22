// Vercel-compatible serverless function
const express = require('express');
const { sanitizeRequest } = require('./middleware/sanitize');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Custom API key middleware for Vercel
function requireApiKey() {
  return (req, res, next) => {
    const apiKey = process.env.API_KEY;
    const apiKeys = process.env.API_KEYS;
    
    if (!apiKey && !apiKeys) {
      return res.status(500).json({ error: 'API key configuration missing on server.' });
    }

    // Get API key from headers
    const providedKey = req.get('x-api-key') || req.get('authorization')?.replace('ApiKey ', '');
    
    if (!providedKey) {
      return res.status(401).json({ error: 'API key required.' });
    }

    // Check against single API_KEY or multiple API_KEYS
    const validKeys = apiKeys ? apiKeys.split(',').map(k => k.trim()) : [apiKey];
    const isValid = validKeys.includes(providedKey);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid API key.' });
    }

    req.authenticatedWithApiKey = true;
    next();
  };
}

// ------------------------
// Environment variables
// ------------------------
const CORS_ORIGINS = process.env.CORS_ORIGINS?.split(',') || [];

// ------------------------
// Initialize Express
// ------------------------
const app = express();

// JSON body parser
app.use(express.json({ limit: '10kb' }));

// Apply sanitation middleware globally
app.use(sanitizeRequest);

// ------------------------
// Security Middlewares
// ------------------------
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (CORS_ORIGINS.length === 0 || CORS_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MIN || 15) * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX || 100),
  message: { error: "Too many requests, please try again later." }
}));

// ------------------------
// Routes
// ------------------------
// Public route (no API key required)
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ Codecraft API is running on Vercel!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Apply API key protection for all /api routes
app.use('/api', requireApiKey());

// Protected test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ API key valid, route protected!',
    timestamp: new Date().toISOString()
  });
});

// Protected test-sanitize route
app.post('/api/test-sanitize', (req, res) => {
  res.json({ 
    message: 'Sanitization successful',
    sanitizedBody: req.body,
    timestamp: new Date().toISOString()
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Export for Vercel
module.exports = app;
