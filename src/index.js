import * as assets from './assets';
import * as contentEntries from './contentEntries';
import * as events from './events';
import { logger, getCurrentTimeOfDayDimValue, getLogLevel } from './logging';
import * as metadata from './metadata';
import * as plugins from './plugins';
import * as session from './session';
import * as userData from './userData';

const logUtils = {
  getCurrentTimeOfDayDimValue,
  getLogLevel
};

const api = {
  assets,
  contentEntries,
  events,
  logger,
  logUtils,
  metadata,
  plugins,
  session,
  userData
};

export default api;
