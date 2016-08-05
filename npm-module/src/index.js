import * as assets from './assets';
import * as contentEntries from './contentEntries';
import * as events from './events';
import { logger, getCurrentTimeOfDayDimValue, getLogLevel } from './logging';
import * as metadata from './metadata';
import * as profile from './profile';
import * as plugins from './plugins';
import * as session from './session';
import * as application from './application';
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
  profile,
  plugins,
  session,
  application,
  userData
};

export default api;
