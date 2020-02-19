module.exports = (app) => {
  app.get('/oauth/allow', (req, res) => {
    if (req.query.status) {
      global.ALLOW_CONNECTION = true;
    } else {
      global.ALLOW_CONNECTION = false;
    }

    res.send({ message: 'User Status Changed', ALLOW_CONNECTION: global.ALLOW_CONNECTION });
  });
};
