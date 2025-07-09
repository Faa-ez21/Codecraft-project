const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const testRoutes = require('./routes/testRoutes');
app.use('/api/test', testRoutes);

// Root
app.get('/', (req, res) => {
  res.send('Backend is up and running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
