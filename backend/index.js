const express = require('express');
const cors = require('cors');
require('dotenv').config(); // 👈 This line loads variables from .env

const app = express();

// Use the PORT from .env, or default to 5000 if not set
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.send('✅ Backend is up and running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
