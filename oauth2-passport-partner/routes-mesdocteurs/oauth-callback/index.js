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
/*     created: 16/03/20 09:23:48 by Quentin MesDocteur                                 */
/*     updated: 07/08/20 11:36:02 by Guillaume Torresani                                */
/*                                                                                      */
/* ************************************************************************************ */

const path = require('path');
const request = require('superagent');

module.exports = (app) => {
  app.get('/oauth/callback', async (req, res) => {
    try {
      const { session, query } = req;
      const { oauth2 } = session;
      const { state, code } = query;

      if (!state) {
        res.status(400).end('Missing required parameter: state');
        return;
      }
      if (!code) {
        res.status(400).end('Missing required parameter: code');
        return;
      }
      if (!oauth2) {
        res.status(400).end('Uninitialized session');
        return;
      }
      if (!oauth2.find((s) => s.state === state)) {
        res.status(400).end('Invalid state');
        return;
      }

      // Step 1 - Fetch User Token
      const fetchUserToken = await request
        .post(`${process.env.MD_API_BASEURL}/oauth/token`)
        .send({
          redirect_uri: `http://0.0.0.0:${process.env.PORT_MD}/oauth/callback`,
          grant_type: 'authorization_code',
          client_id: process.env.MD_CLIENT_ID,
          client_secret: process.env.MD_CLIENT_SECRET,
          code,
        });
      /**
       * @param {Object} fetchUserToken
       * @param {Object} fetchUserToken.body
       * @param {string} fetchUserToken.body.access_token
       */
      const accessToken = fetchUserToken.body.access_token;

      // Step 2 - Fetch User Information
      const fetchUsersData = await request
        .get(`${process.env.MD_API_BASEURL}/whoami`)
        .auth(accessToken, { type: 'bearer' });

      res.render(path.join(__dirname, 'index'), { ...fetchUsersData.body });
    } catch (error) {
      res.send('Fatal Error');
    }
  });
};
