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
      next: Buffer.from(`${process.env.MD_OAUTH_BASEURL}/oauth/authorize?client_id=${process.env.MD_CLIENT_ID}&response_type=code&scope=profile&state=${state}`).toString('base64'),
      clientId: process.env.PARTNER_CLIENT_ID,
      base: process.env.MD_OAUTH_BASEURL,
    });
  });
};
