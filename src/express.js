const cookieParser = require('cookie-parser')();

const SIXTY_YEARS_IN_MS = 2147483647000;
const COOKIE_DEVICE_ID = 'ag_d';
const COOKIE_SESSION_KEY = 'ag_s';

// default functions for the cookie persistency strategy (deviceId and sessionKey) and gid passed as a query param
const defaultGetRequestInfo = (req) => ({
  deviceId: req.cookies[COOKIE_DEVICE_ID],
  sessionKey: req.cookies[COOKIE_SESSION_KEY],
  gid: req.query.gid
});
const defaultOnDeviceIdGenerated = (id, res) => res.cookie(COOKIE_DEVICE_ID, id, { maxAge: SIXTY_YEARS_IN_MS, httpOnly: true });
const defaultOnSessionKeyChanged = (key, res) => res.cookie(COOKIE_SESSION_KEY, key, { maxAge: SIXTY_YEARS_IN_MS, httpOnly: true });

// See doc in index.js where this is used
const factory = (appgrid) => (config) => {
  const {
    getRequestInfo = defaultGetRequestInfo,
    onDeviceIdGenerated = defaultOnDeviceIdGenerated,
    onSessionKeyChanged = defaultOnSessionKeyChanged,
  } = config;
  return (req, res, next) => cookieParser(req, res, () => {
    const { deviceId, sessionKey, gid } = getRequestInfo(req);
    const clientOptions = {
      deviceId,
      sessionKey,
      ip: req.ip,
      onDeviceIdGenerated: id => onDeviceIdGenerated(id, res),
      onSessionKeyChanged: key => onSessionKeyChanged(key, res)
    };
    // Add the gid if it was found by getRequestInfo, and not an empty string (otherwise, we will use the one passed in the config if any)
    if (gid) {
      clientOptions.gid = gid;
    }
    // Let anything given in config pass through as a client option as well
    const client = appgrid(Object.assign({}, config, clientOptions));
    // res.locals is a good place to store response-scoped data
    res.locals.appgridClient = client;
    next();
  });
};

export default factory;
