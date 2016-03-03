// TODO JASON: Figure out session-handling
// TODO JASON: Update the api to include a means to send all logs to the consumer (who could then choose how to log them)


import * as events from './events';
import { logger } from './logging';

const api = {
  events,
  logger
};

export default api;
