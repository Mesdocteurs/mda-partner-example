const exitIfRequiredKeysAreInObject = (keys = [], object = {}) => {
  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index];
    if (!object[key]) {
      console.log(`[ERROR] '${key}' environment variable is required !`);
      process.exit(1);
    }
  }
};

module.exports = () => {
  exitIfRequiredKeysAreInObject(['PARTNER_CLIENT_ID', 'PARTNER_CLIENT_SECRET', 'MD_CLIENT_ID', 'MD_CLIENT_SECRET', 'MD_OAUTH_BASEURL', 'MD_API_BASEURL'], process.env);
};
