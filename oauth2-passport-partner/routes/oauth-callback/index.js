const fetch = require('node-fetch');

const requiredKeysAreInObject = (keys = [], object = {}) => {
  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index];
    if (!object[key]) {
      return false;
    }
  }
  return true;
};

module.exports = (app) => {
  app.get('/oauth/callback', async (req, res) => {
    if (!requiredKeysAreInObject(['next', 'code', 'state'], req.query)) {
      res.status(400).json({ message: 'Query Vars Error' });
      return;
    }

    if (!global.STATE_ARRAYS.includes(req.query.state)) {
      res.status(400).json({ message: 'Wrong State' });
      return;
    }

    global.STATE_ARRAYS.splice(global.STATE_ARRAYS.indexOf(req.query.state), 1);

    try {
      // Step 1 - Fetch User Token
      const fetchUserToken = await fetch(`${process.env.MD_API_BASEURL}/oauth/token`, {
        method: 'POST',
        body: JSON.stringify({
          redirect_uri: `${global.baseURL}/oauth/callback?next=${req.query.next}`,
          grant_type: 'authorization_code',
          client_id: process.env.PARTNER_CLIENT_ID,
          client_secret: process.env.PARTNER_CLIENT_SECRET,
          code: req.query.code,
        }),
        headers: { 'Content-Type': 'application/json' },
      }).then((resp) => resp.json());

      console.log('step 1');

      // Step 2 - Fetch User Information
      const fetchUsersData = await fetch(`${process.env.MD_API_BASEURL}/whoami`, {
        method: 'GET',
        headers: { Authorization: fetchUserToken.access_token },
      }).then((resp) => resp.json());

      console.log('step 2');

      // Step 3 - Fetch Application Token
      const fetchApplicationToken = await fetch(`${process.env.MD_API_BASEURL}/oauth/token`, {
        method: 'POST',
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: process.env.MD_CLIENT_ID,
          client_secret: process.env.MD_CLIENT_SECRET,
        }),
        headers: { 'Content-Type': 'application/json' },
      }).then((resp) => resp.json());

      console.log('step 3');

      // Step 4 - Allow User in App
      await fetch(`${process.env.MD_API_BASEURL}/api/OAuthClientApplications/authorize`, {
        method: 'PUT',
        body: JSON.stringify({
          user_id: fetchUsersData.id,
          client_secret: process.env.MD_CLIENT_SECRET,
          status: global.ALLOW_CONNECTION,
        }),
        headers: { Authorization: fetchApplicationToken.access_token, 'Content-Type': 'application/json' },
      });

      console.log('step 4');
      console.log(Buffer.from(req.query.next, 'base64').toString());

      res.redirect(`${Buffer.from(req.query.next, 'base64').toString()}&userId=${fetchUsersData.id}`);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'OAuth Process Error' });
    }
  });
};
