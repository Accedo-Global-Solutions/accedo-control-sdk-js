import * as events from './events';
import { logger, getCurrentTimeOfDayDimValue, getLogLevel } from './logging';
import * as metadata from './metadata';
import * as session from './session';

const logUtils = {
  getCurrentTimeOfDayDimValue,
  getLogLevel
};

const api = {
  events,
  logger,
  logUtils,
  metadata,
  session
};

export default api;
