const cookieParser = require('cookie-parser')();

const SIXTY_YEARS_IN_MS = 2147483647000;
const COOKIE_DEVICE_ID = 'ag_d';
const COOKIE_SESSION_KEY = 'ag_s';

// default functions for the cookie peristency strategy
const defaultGetRequestInfo = (req) => ({ deviceId: req.cookies[COOKIE_DEVICE_ID], sessionKey: req.cookies[COOKIE_SESSION_KEY] });
const defaultOnDeviceIdGenerated = (id, res) => res.cookie(COOKIE_DEVICE_ID, id, { maxAge: SIXTY_YEARS_IN_MS, httpOnly: true });
const defaultOnSessionKeyChanged = (key, res) => res.cookie(COOKIE_SESSION_KEY, key, { maxAge: SIXTY_YEARS_IN_MS, httpOnly: true });

// See doc in index.js where this is used
const factory = (appgrid) => (config) => {
  const {
    appKey,
    getRequestInfo = defaultGetRequestInfo,
    onDeviceIdGenerated = defaultOnDeviceIdGenerated,
    onSessionKeyChanged = defaultOnSessionKeyChanged,
    log
  } = config;
  return (req, res, next) => cookieParser(req, res, () => {
    const { deviceId, sessionKey } = getRequestInfo(req);
    // res.locals is a good place to store response-scoped data
    res.locals.appgridClient = appgrid({
      appKey,
      deviceId,
      sessionKey,
      log,
      ip: req.ip,
      onDeviceIdGenerated: id => onDeviceIdGenerated(id, res),
      onSessionKeyChanged: key => onSessionKeyChanged(key, res)
    });
    next();
  });
};

export default factory;
