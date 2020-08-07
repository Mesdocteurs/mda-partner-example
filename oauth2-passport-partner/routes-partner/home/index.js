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
/*     created: 06/08/20 14:41:00 by Quentin MesDocteur                                 */
/*     updated: 07/08/20 11:14:41 by Guillaume Torresani                                */
/*                                                                                      */
/* ************************************************************************************ */

const path = require('path');

module.exports = (app) => {
  app.get('/', (req, res) => {
    if (!req.session.oauth2) {
      req.session.oauth2 = [];
    }
    const state = Math.random().toString(36).substring(2, 15);
    req.session.oauth2.push({
      state,
      next: `http://0.0.0.0:${process.env.PORT_MD}/oauth/authorize`,
      allow: false,
    });
    res.render(path.join(__dirname, 'index'), {
      state,
      clientId: process.env.PARTNER_CLIENT_ID,
      base: process.env.MD_OAUTH_BASEURL,
    });
  });
};
