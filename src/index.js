import * as assets from './assets';
import * as events from './events';
import { logger, getCurrentTimeOfDayDimValue, getLogLevel } from './logging';
import * as metadata from './metadata';
import * as session from './session';

const logUtils = {
  getCurrentTimeOfDayDimValue,
  getLogLevel
};

const api = {
  assets,
  events,
  logger,
  logUtils,
  metadata,
  session
};

export default api;
