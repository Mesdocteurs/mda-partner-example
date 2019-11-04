const express = require('express');
const passport = require('passport');
const request = require('request-promise');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
// app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
//
// app.use(cookieParser('keyboard cat', {})); //read cookies (needed for auth)
// app.use(bodyParser.json());
//
app.use(passport.initialize({}));
// app.use(passport.session({}));

const strategy = new OAuth2Strategy(
    {
        authorizationURL: 'http://0.0.0.0:3000/oauth/authorize',
        tokenURL: 'http://0.0.0.0:3000/oauth/token',
        clientID: '6f6047b7b43f94b358d1294cb58f83d9',
        clientSecret: '0a78afc9a6c2f991db86f2de35e7c3527d7a05d10eb6b9b6168e845e676e2cf1ef7e41653964e916400afc1a396c798ded9f7d6ac0e63e3f78a353426073688a1087ca0ab76d583295e9a4f2c3923a0beaaae63864089e0e763e2812712048b45c3d1871ad7dec89be8b8ebd2d2997783d90dcfef963711ed71894c9098c58ebc6437cf94fa88349b838e377ddbf1f00d292382c99be1d3143bd8ac9198973b559fcb3fb08178a721b0ad7d95040d90cb1d15756219925e16dd1d5e184bfda22d9e27e52714955f46d89c05f827a9244afb0afb4ea0f153c6e6aae509f374902e2d14928552181fec19151a0500550b9355e5db614ad49439a25912670a1b672',
        callbackURL: 'http://0.0.0.0:3001/oauth/example/callback',
        scope: 'profile',
        state: true,
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log("Here!");
      console.log(accessToken);
      console.log(refreshToken);
      console.log(profile);
      cb(null, profile);
    }
);

strategy.userProfile = (accessToken, done) => {
  (async() => {
    try {
      console.log('userProfile');
      // return await request({
      //   uri: `http://0.0.0.0:3000/whoami?access_token=${accessToken}`,
      //   // qs: {
      //   //   access_token: accessToken
      //   // },
      //   strictSSL: false,
      //   headers: {
      //     'User-Agent': 'Request-Promise',
      //     'Content-Type': 'application/json',
      //     'accept': 'application/json',
      //   },
      //   json: true,
      //   resolveWithFullResponse: true,
      // });
      return done(null, {
        firstname: 'jo',
        lastname: 'carrie'
      });
    } catch (e) {
      console.log(e);
      return done(e);
    }
  })();
};

passport.use('oauth2', strategy);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(async(user, done) => {
    // user = await app.models.AppUser.findById(user.id);
    done(null, {
      firstname: 'jojo'
    });
});

app.get('/login', passport.authenticate('oauth2'));

app.get('/oauth/example/callback', passport.authenticate('oauth2', {
    failureRedirect: '/failed',
}), (req, res) => {
    const user = req.session.passport.user;
    console.log('user', user);
    res.send('OKAY');
});

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
    res.send('hello world');
});
// respond with "hello world" when a GET request is made to the homepage
app.get('/failed', function(req, res) {
    res.send('FAILED');
});

app.listen(3001, function () {
    console.log('Example app listening on port 3001!')
});
