// ------------------------
// 1️⃣ Imports & setup
// ------------------------
const express = require('express');
const { sanitizeRequest } = require('./middleware/sanitize');
const { requireApiKey } = require('./middleware/apiKey'); // ✅ API key middleware
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
const HTTP_PORT = Number(process.env.PORT || 5000);
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
// 4️⃣ Load HTTPS certs
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

// ------------------------
// 5️⃣ Security Middlewares
// ------------------------
app.use(helmet({
  contentSecurityPolicy: false, // disable CSP for dev; enable in prod
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || CORS_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MIN || 15) * 60 * 1000, // default 15 mins
  max: Number(process.env.RATE_LIMIT_MAX || 100), // default 100 requests
  message: { error: "Too many requests, please try again later." }
}));

// ------------------------
// 6️⃣ Routes
// ------------------------

// Public test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is up and running over HTTPS, sanitized & secured!' });
});

// Public home
app.get('/', (req, res) => {
  res.send('✅ Backend is up and running securely with sanitation!');
});

// ✅ Protected routes (API key required)
app.use(
  '/api/safe',
  requireApiKey({
    headerName: 'x-api-key',
    allowQuery: false,
    logFn: (info) => console.warn('API auth failed:', info)
  }),
  require('./routes/safeRoutes')
);

// Example single protected endpoint
// app.post('/api/protected-endpoint',
//   requireApiKey(),
//   (req, res) => res.json({ secret: "This is protected data" })
// );

// ------------------------
// 7️⃣ HTTPS & HTTP Servers
// ------------------------
https.createServer(httpsOptions, app)
  .listen(HTTPS_PORT, '0.0.0.0', () => {
    console.log(`✅ HTTPS server running on https://localhost:${HTTPS_PORT}`);
  })
  .on('error', err => {
    console.error("❌ Failed to start HTTPS server:", err.message);
    process.exit(1);
  });

http.createServer((req, res) => {
  res.writeHead(301, { "Location": `https://localhost:${HTTPS_PORT}${req.url}` });
  res.end();
}).listen(HTTP_PORT, () => {
  console.log(`ℹ️  HTTP server running on http://localhost:${HTTP_PORT} (redirects to HTTPS)`);
});
