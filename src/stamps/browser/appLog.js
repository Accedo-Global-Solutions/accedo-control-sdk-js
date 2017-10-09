const { post } = require('../../apiHelper');
const { ALLOWED_LEVELS, getLogEvent } = require('../makeAppLog');

const OFF = 'off';
const LOG_LEVELS = [...ALLOWED_LEVELS, OFF];

// Refer to the Node implementation at `../node/appLog` for the doc
function sendLog(level, details, ...metadata) {
  const cleanMeta = !metadata.length
    ? undefined
    : metadata.length === 1 ? metadata[0] : metadata;
  const log = getLogEvent(details, cleanMeta);
  return this.withSessionHandling(() => {
    return this.getLogLevel().then(currentLevel => {
      if (LOG_LEVELS.indexOf(currentLevel) > LOG_LEVELS.indexOf(level)) {
        return Promise.resolve({
          status: 200,
          statusText: 'Request avoided',
          // this is especially useful for tests
          requestAvoided: true,
        });
      }
      return post(`/application/log/${level}`, this.props.config, log);
    });
  });
}

module.exports.sendLog = sendLog;
