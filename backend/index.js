// ------------------------
// 1️⃣ Imports & setup
// ------------------------
const express = require('express');
const { sanitizeRequest } = require('./middleware/sanitize');
const { requireApiKey } = require('./middleware/api-key');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
require('dotenv').config();

// ------------------------
// 2️⃣ Environment variables
// ------------------------
const HTTPS_PORT = Number(process.env.HTTPS_PORT || 5445);
const HTTP_PORT = Number(process.env.PORT || 5050);
const CORS_ORIGINS = process.env.CORS_ORIGINS?.split(',') || [];

// ------------------------
// 3️⃣ Initialize Express
// ------------------------
const app = express();

// JSON body parser
app.use(express.json({ limit: '10kb' }));

// Apply sanitation middleware globally
app.use(sanitizeRequest);

// ------------------------
// 4️⃣ Security Middlewares
// ------------------------
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || CORS_ORIGINS.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MIN || 15) * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX || 100),
  message: { error: "Too many requests, please try again later." }
}));

// ------------------------
// 5️⃣ Routes
// ------------------------
// Public route (no API key required)
app.get('/', (req, res) => {
  res.json({ message: '✅ API key is valid 🎉 Backend secured & running over HTTPS!' });
});

// Apply API key protection for all /api routes
app.use('/api', requireApiKey());

// Protected test route
app.get('/api/test', (req, res) => {
  res.json({ message: '✅ API key valid, route protected!' });
});

// ------------------------
// 🧹 Protected test-sanitize route
// ------------------------
app.post('/api/test-sanitize', (req, res) => {
  // Echo back the sanitized request body
  res.json({ sanitizedBody: req.body });
});

// ------------------------
// 6️⃣ HTTPS & HTTP Servers
// ------------------------
let httpsOptions;
try {
  httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'localhost-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'localhost.pem'))
  };
} catch (err) {
  console.error("❌ Could not load SSL certificate/key:", err.message);
  process.exit(1);
}

// HTTPS server
https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
  console.log(`✅ HTTPS server running on https://localhost:${HTTPS_PORT}`);
});

// HTTP server (redirects to HTTPS)
http.createServer((req, res) => {
  res.writeHead(301, { "Location": `https://localhost:${HTTPS_PORT}${req.url}` });
  res.end();
}).listen(HTTP_PORT, () => {
  console.log(`ℹ️ HTTP server running on http://localhost:${HTTP_PORT} (redirects to HTTPS)`);
});
