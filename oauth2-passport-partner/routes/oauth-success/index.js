/* ************************************************************************************ */
/*     __  __           ____             _                                              */
/*    |  \/  | ___  ___|  _ \  ___   ___| |_ ___ _   _ _ __ ___   ___ ___  _ __ ___     */
/*    | |\/| |/ _ \/ __| | | |/ _ \ / __| __/ _ \ | | | '__/ __| / __/ _ \| '_ ` _ \    */
/*    | |  | |  __/\__ \ |_| | (_) | (__| ||  __/ |_| | |  \__ \| (_| (_) | | | | | |   */
/*    |_|  |_|\___||___/____/ \___/ \___|\__\___|\__,_|_|  |___(_)___\___/|_| |_| |_|   */
/*                                                                                      */
/*     index.js                                                                         */
/*                                                                                      */
/*     By: Guillaume TORRESANI <g.torresani@mesdocteurs.com>                            */
/*                                                                                      */
/*     created: 03/31/20 17:53:02 by Guillaume TORRESANI                                */
/*     updated: 04/09/20 15:16:41 by Guillaume TORRESANI                                */
/*                                                                                      */
/* ************************************************************************************ */

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

      // Step 2 - Fetch User Information
      const fetchUsersData = await fetch(`${process.env.MD_API_BASEURL}/whoami`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${fetchUserToken.access_token}` },
      }).then((resp) => resp.json());

      res.render(path.join(__dirname, 'index'), { ...fetchUsersData });
    } catch (error) {
      res.send('Fatal Error');
    }
  });
};
