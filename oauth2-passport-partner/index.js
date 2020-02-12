const express = require('express');
require('dotenv').config();

// Check if required env vars are loaded
require('./config/envVars')();


const port = parseInt(process.env.PORT, 10) || 3000;

const app = express();
app.set('view engine', 'ejs');

// Load Routes
require('./routes/home')(app);
require('./routes/oauth-callback')(app);
require('./routes/oauth-allow')(app);
require('./routes/oauth-success')(app);

app.get('*', (req, res) => {
  res.redirect('/');
});


app.listen(port, '0.0.0.0', () => {
  // Init context vars
  global.ALLOW_CONNECTION = false;
  global.STATE_ARRAYS = [];
  global.baseURL = `http://0.0.0.0:${port}`;

  console.log(`[INFO] Server is listening on 0.0.0.0:${port}`);
});
