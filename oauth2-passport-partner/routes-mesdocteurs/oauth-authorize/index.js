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
/*     created: 06/08/20 16:03:07 by Quentin MesDocteur                                 */
/*     updated: 07/08/20 11:12:43 by Guillaume Torresani                                */
/*                                                                                      */
/* ************************************************************************************ */

const URL = require('url');

module.exports = (app) => {
  app.get('/oauth/authorize', (req, res) => {
    if (!req.session.oauth2) {
      req.session.oauth2 = [];
    }
    const state = Math.random().toString(36).substring(2, 15);
    req.session.oauth2.push({
      state,
    });
    const redirect = URL.parse(process.env.MD_OAUTH_BASEURL);
    redirect.pathname = '/oauth/authorize';
    redirect.query = {
      redirect_uri: `http://0.0.0.0:${process.env.PORT_MD}/oauth/callback`,
      client_id: process.env.MD_CLIENT_ID,
      response_type: 'code',
      scope: 'user.email.ro user.profile.ro user.address.ro',
      state,
      prompt: 'none',
    };
    res.redirect(URL.format(redirect));
  });
};
