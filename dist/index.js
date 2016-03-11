'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assets = require('./assets');

var assets = _interopRequireWildcard(_assets);

var _contentEntries = require('./contentEntries');

var contentEntries = _interopRequireWildcard(_contentEntries);

var _events = require('./events');

var events = _interopRequireWildcard(_events);

var _logging = require('./logging');

var _metadata = require('./metadata');

var metadata = _interopRequireWildcard(_metadata);

var _plugins = require('./plugins');

var plugins = _interopRequireWildcard(_plugins);

var _session = require('./session');

var session = _interopRequireWildcard(_session);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var logUtils = {
  getCurrentTimeOfDayDimValue: _logging.getCurrentTimeOfDayDimValue,
  getLogLevel: _logging.getLogLevel
};

var api = {
  assets: assets,
  contentEntries: contentEntries,
  events: events,
  logger: _logging.logger,
  logUtils: logUtils,
  metadata: metadata,
  plugins: plugins,
  session: session
};

exports.default = api;