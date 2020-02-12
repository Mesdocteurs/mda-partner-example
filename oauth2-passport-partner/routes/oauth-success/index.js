
module.exports = (app) => {
  app.get('/oauth/success', (req, res) => {
    res.send('OAuth Process Success');
  });
};
