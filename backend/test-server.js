const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('✅ Bare server is working!');
});

app.listen(5000, () => {
  console.log('✅ Bare test server is running on port 5000');
});
