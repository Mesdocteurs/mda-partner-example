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
/*     updated: 07/08/20 12:15:19 by Guillaume Torresani                                */
/*                                                                                      */
/* ************************************************************************************ */

const request = require('superagent');

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
    const { session, query } = req;
    const { oauth2 } = session;
    if (!requiredKeysAreInObject(['code', 'state'], query)) {
      res.status(400).json({ message: 'Query Vars Error' });
      return;
    }

    const { state, code } = query;
    if (!oauth2) {
      res.status(400).end('Uninitialized session');
      return;
    }

    if (!oauth2.find((s) => s.state === state)) {
      res.status(400).json({ message: 'Wrong State' });
      return;
    }
    const redirect = oauth2.find((s) => s.state === state);

    try {
      // Step 1 - Fetch User Token
      const fetchUserToken = await request
        .post(`${process.env.MD_API_BASEURL}/oauth/token`)
        .send({
          redirect_uri: `${global.baseURL}/oauth/callback`,
          grant_type: 'authorization_code',
          client_id: process.env.PARTNER_CLIENT_ID,
          client_secret: process.env.PARTNER_CLIENT_SECRET,
          code,
        });
      const accessToken = fetchUserToken.body.access_token;

      // Step 2 - Fetch User Information
      const fetchUsersData = await request
        .get(`${process.env.MD_API_BASEURL}/whoami`)
        .auth(accessToken, { type: 'bearer' });
      const { sub } = fetchUsersData.body;

      // Step 3 - Allow User in App
      await request
        .put(`${process.env.MD_API_BASEURL}/oauth/authorize/user`)
        .auth(process.env.MD_CLIENT_ID, process.env.MD_CLIENT_SECRET, { type: 'basic' })
        .send({
          sub,
          status: redirect.allow,
        });

      res.redirect(redirect.next);
    } catch
    (error) {
      res.status(400).json({ message: 'OAuth Process Error' });
    }
  });
};
