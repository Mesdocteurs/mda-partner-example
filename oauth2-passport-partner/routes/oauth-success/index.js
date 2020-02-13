const path = require('path');
const fetch = require('node-fetch');

module.exports = (app) => {
  app.get('/oauth/success', async (req, res) => {
    try {
      // Step 1 - Fetch User Token
      const fetchUserToken = await fetch(`${process.env.MD_API_BASEURL}/oauth/token`, {
        method: 'POST',
        body: JSON.stringify({
          grant_type: 'authorization_code',
          client_id: process.env.MD_CLIENT_ID,
          client_secret: process.env.MD_CLIENT_SECRET,
          code: req.query.code,
        }),
        headers: { 'Content-Type': 'application/json' },
      }).then((resp) => resp.json());

      console.log(fetchUserToken);

      // Step 2 - Fetch User Information
      const fetchUsersData = await fetch(`${process.env.MD_API_BASEURL}/whoami`, {
        method: 'GET',
        headers: { Authorization: fetchUserToken.access_token },
      }).then((resp) => resp.json());

      res.render(path.join(__dirname, 'index'), { ...fetchUsersData });
    } catch (error) {
      res.send('Fatal Error');
    }
  });
};
