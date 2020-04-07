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
/*     created: 04/07/20 12:26:26 by Guillaume TORRESANI                                */
/*     updated: 04/07/20 14:22:43 by Guillaume TORRESANI                                */
/*                                                                                      */
/* ************************************************************************************ */

const path = require('path');

const generateHash = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

module.exports = (app) => {
  app.get('/', (req, res) => {
    const state = generateHash(9);
    global.STATE_ARRAYS.push(state);
    res.render(path.join(__dirname, 'index'), {
      state,
      next: Buffer.from(`${process.env.MD_OAUTH_BASEURL}/oauth/authorize?client_id=${process.env.MD_CLIENT_ID}&response_type=code&scope=user.email.ro user.profile.ro user.address.ro&state=${state}`).toString('base64'),
      clientId: process.env.PARTNER_CLIENT_ID,
      base: process.env.MD_OAUTH_BASEURL,
    });
  });
};
