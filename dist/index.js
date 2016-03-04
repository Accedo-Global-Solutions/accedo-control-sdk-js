'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('./events');

var events = _interopRequireWildcard(_events);

var _logging = require('./logging');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// TODO JASON: Figure out session-handling
// TODO JASON: Update the api to include a means to send all logs to the consumer (who could then choose how to log them)

var logUtils = {
  getCurrentTimeOfDayDimValue: _logging.getCurrentTimeOfDayDimValue
};

var api = {
  events: events,
  logger: _logging.logger,
  logUtils: logUtils
};

exports.default = api;