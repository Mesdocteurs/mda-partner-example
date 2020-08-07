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
/*     updated: 06/08/20 16:03:07 by Guillaume Torresani                                */
/*                                                                                      */
/* ************************************************************************************ */

module.exports = (app) => {
  app.get('/oauth/allow', (req, res) => {
    const { session, query } = req;
    const { oauth2 } = session;
    const { state, status } = query;
    if (!oauth2) {
      res.status(400).end('Uninitialized session');
    } else {
      oauth2.forEach((e, index) => {
        if (e.state === state) {
          req.session.oauth2[index].allow = status;
        }
      });
      res.send({ message: 'User Status Changed', ALLOW_CONNECTION: status });
    }
  });
};
