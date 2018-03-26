const sessionStamp = require('../session');
const appLogCommon = require('../appLogCommon');
const { post } = require('../../apiHelper');

const { ALLOWED_LEVELS, getLogEvent } = appLogCommon;
const OFF = 'off';
const LOG_LEVELS = [...ALLOWED_LEVELS, OFF];
const POST_SIZE_LIMIT = 2000000; // Roughly 2 MB, max allowed
const POST_SIZE_TARGET = 200000; // Roughly 200 KB, our target for batches
const DEBOUNCE_BATCH = 1000 * 60 * 2; // Send batch if last one was added 2 mn ago

// Deconstruct the batch immediately so we use the contained values
// before they possibly change
function sendBatch({ data, timeoutID }) {
  clearTimeout(timeoutID);
  if (!data.length) {
    return Promise.resolve();
  }

  return this.withSessionHandling(() =>
    post('/application/logs', this.config, `[${data.join(',')}]`, true)
  ).catch(err => {
    this.config.log(
      `The batched logs could not be sent. ${data.length} logs lost`,
      err
    );
    throw err;
  });
}

const resetBatch = () => ({
  data: [],
  totalLength: 0,
  timeoutID: undefined,
});

function setNavigationListeners(action) {
  try {
    window.addEventListener('beforeunload', action);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        action();
      }
    });
  } catch (err) {
    // eslint-disable-next-line
    console.error('Accedo One SDK event listeners could not be attached', err);
  }
}

// Make sure we have the sessionStamp withSessionHandling method AND appLogCommon
const stamp = sessionStamp.compose(appLogCommon, {
  init(_, { instance }) {
    let batchedLogs = resetBatch();

    const flush = () => {
      sendBatch.call(instance, batchedLogs);
      batchedLogs = resetBatch();
    };

    const queue = log => {
      batchedLogs.data.push(log);
      batchedLogs.totalLength += log.length;
      clearTimeout(batchedLogs.timeoutID);
      batchedLogs.timeoutID = setTimeout(flush, DEBOUNCE_BATCH);
    };

    // Try to flush the logs if the user navigates away from the page,
    // closes it, or switches away from this browser tab
    setNavigationListeners(flush);

    /**
     * NOTE: the behaviour varies when run on Node.js or on browsers.
     *
     * On Node.js, the log will be sent immediately.
     *
     * On browsers: add the log to a queue so several logs may be sent as a batch,
     * when a predefined total size is reached or after a debouncing delay.
     * Whenever the user navigates away, the SDK will also attempt to send
     * any queued-up log.
     *
     * If the current log level is high enough, lower level logs will be ignored.
     *
     * @param {'debug'|'info'|'warn'|'error'} level the log level
     * @param {object} details the log information
     * @param {string} details.message the log message
     * @param {number} details.errorCode the error code (max 5 digits)
     * @param {string} details.dim1 the dimension 1 information
     * @param {string} details.dim2 the dimension 2 information
     * @param {string} details.dim3 the dimension 3 information
     * @param {string} details.dim4 the dimension 4 information
     * @param {any} [metadata] extra metadata (will go through JSON.stringify).
     *                         Can be passed as any number of trailing arguments.
     * @return {promise}  a promise of the success of the operation
     *                    (queuing on browser, posting on Node.js)
     */
    instance.sendLog = (level, details, ...metadata) => {
      if (!ALLOWED_LEVELS.includes(level)) {
        return Promise.reject('Unsupported log level');
      }

      return instance.getLogLevel().then(currentLevel => {
        // Discard logs that are below the current level
        if (LOG_LEVELS.indexOf(currentLevel) > LOG_LEVELS.indexOf(level)) {
          return Promise.resolve({
            status: 200,
            statusText: 'Request avoided',
            // this is especially useful for tests
            requestAvoided: true,
          });
        }

        const cleanMeta = !metadata.length
          ? undefined
          : metadata.length === 1 ? metadata[0] : metadata;

        // Prepare the log
        const log = JSON.stringify(
          Object.assign(getLogEvent(details, cleanMeta), {
            logType: level,
            timestamp: Date.now(),
          })
        );

        const logLength = log.length;

        // Reject if the log is too long by itself
        if (logLength > POST_SIZE_LIMIT) {
          return Promise.reject({
            status: 400,
            statusText: 'Request oversized',
          });
        }

        const batchLength = batchedLogs.totalLength;

        // String.length counts the code points, not the characters. That's just what we want.
        if (batchLength + logLength < POST_SIZE_TARGET) {
          // Add this log to the batch
          queue(log);
        } else {
          // Let's send some of the logs as we're getting above the target size.
          // Send the batched logs by themselves if adding this log results
          // in oversize, then add the new log to a new batch.
          // Otherwise send the batch along with this new log, then start a new batch
          const oversized = batchLength + logLength > POST_SIZE_LIMIT;
          if (!oversized) {
            queue(log);
          }
          flush();
          if (oversized) {
            queue(log);
          }
        }

        return Promise.resolve({
          status: 200,
          statusText: 'Request queued for batch',
          // this is especially useful for tests
          requestQueued: true,
        });
      });
    };
  },
});
module.exports = stamp;
