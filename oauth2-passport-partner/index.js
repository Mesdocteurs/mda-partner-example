/* ************************************************************************************ */
/*     __  __           ____             _                                              */
/*    |  \/  | ___  ___|  _ \  ___   ___| |_ ___ _   _ _ __ ___   ___ ___  _ __ ___     */
/*    | |\/| |/ _ \/ __| | | |/ _ \ / __| __/ _ \ | | | '__/ __| / __/ _ \| '_ ` _ \    */
/*    | |  | |  __/\__ \ |_| | (_) | (__| ||  __/ |_| | |  \__ \| (_| (_) | | | | | |   */
/*    |_|  |_|\___||___/____/ \___/ \___|\__\___|\__,_|_|  |___(_)___\___/|_| |_| |_|   */
/*                                                                                      */
/*     index.js                                                                         */
/*                                                                                      */
/*     By: Quentin MesDocteur <q.laffont@mesdocteurs.com>                               */
/*                                                                                      */
/*     created: 12/02/20 17:16:44 by Quentin MesDocteur                                 */
/*     updated: 07/08/20 11:06:08 by Guillaume Torresani                                */
/*                                                                                      */
/* ************************************************************************************ */

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();

// Check if required env vars are loaded
require('./config/envVars')();

const port = parseInt(process.env.PORT, 10) || 3000;

const app = express();
app.use(cookieParser('!md4P1S3cr3t#'));
app.set('trust proxy', 1);
app.use(session({
  secret: 'secret',
  name: 'oauth-partner',
  saveUninitialized: true,
  resave: false,
  cookie: {
    httpOnly: false,
    expires: 60 * 60 * 1000,
    secure: false,
  },
}));
app.set('view engine', 'ejs');

// Load Routes
require('./routes-partner/home')(app);
require('./routes-partner/oauth-callback')(app);
require('./routes-partner/oauth-authorize')(app);

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

// Server for Member Access when oauth partner process is complete
const portAppSuccess = parseInt(process.env.PORT, 10) + 1 || 3001;
process.env.PORT_MD = String(portAppSuccess);

const appSuccess = express();
appSuccess.use(cookieParser('!md4P1S3cr3t#'));
appSuccess.set('trust proxy', 1);
appSuccess.use(session({
  secret: 'secret',
  name: 'oauth-partner',
  saveUninitialized: true,
  resave: false,
  cookie: {
    httpOnly: false,
    expires: 60 * 60 * 1000,
    secure: false,
  },
}));
appSuccess.set('view engine', 'ejs');

// Load Routes
require('./routes-mesdocteurs/oauth-callback')(appSuccess);
require('./routes-mesdocteurs/oauth-authorize')(appSuccess);

appSuccess.listen(portAppSuccess, '0.0.0.0', () => {
  console.log(`[INFO] Server is listening on 0.0.0.0:${portAppSuccess}`);
});
