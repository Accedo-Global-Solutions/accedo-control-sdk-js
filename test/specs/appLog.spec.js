require('../fakeNetworkCalls');
const factory = require('../../src/node/index');

const okStatus = 200;
const logFacilityCode = '13';

const nightOrDay = () => {
  const hour = new Date().getHours();
  // NOTE: These strings are expected by AppGrid
  switch (true) {
    case hour < 5 || hour > 17:
      return 'night';
    default:
      return 'day';
  }
};

// NOTE: This is simply a convenience/helper method for building a logEvent object.
const getLogEventOptions = (message, facilityCode) => {
  const networkErrorCode = '002';
  const middlewareSourceCode = 'service-mw';
  const noneViewName = 'sdk_unit_test';
  const deviceType = 'desktop';
  return {
    message,
    errorCode: networkErrorCode,
    facilityCode,
    dim1: middlewareSourceCode,
    dim2: noneViewName,
    dim3: deviceType,
    dim4: nightOrDay(),
  };
};

describe('Logging API', () => {
  const client = factory({
    appKey: '56ea6a370db1bf032c9df5cb',
    deviceId: 'gregTestingSDK',
    // log(...args) { console.log(...args); },
  });

  test('getLogLevel should yield a string', () => {
    return client.getLogLevel().then(logLevel => {
      expect(typeof logLevel).toBe('string');
    });
  });

  test('sendLog should successfully send a log-message to AppGrid for each log-level', () => {
    const promises = ['debug', 'info', 'warn', 'error'].map(level => {
      const exampleInfoEventOptions = getLogEventOptions(
        `This is a ${level} entry!`,
        logFacilityCode
      );
      return client.sendLog(level, exampleInfoEventOptions).then(response => {
        // NOTE: for some reason: debug results in an undefined response from AppGrid
        if (!response && level === 'debug') {
          return;
        }
        expect(response.status).toBe(okStatus);
      });
    });
    return Promise.all(promises);
  });

  test('sendLog should successfully send a log-message with Metadata to AppGrid for each log-level', () => {
    const promises = ['debug', 'info', 'warn', 'error'].map(level => {
      const exampleInfoEventOptions = getLogEventOptions(
        `This is a new ${level} entry with Metadata!`,
        logFacilityCode
      );
      const exampleMetadata = { someMetadataKey: 'someValue' };
      return client
        .sendLog(level, exampleInfoEventOptions, exampleMetadata)
        .then(response => {
          // NOTE: for some reason: debug results in an undefined response from AppGrid
          if (!response && level === 'debug') {
            return;
          }
          expect(response.status).toBe(okStatus);
        });
    });
    return Promise.all(promises);
  });

  test('sendLogs should successfully send batched logs with Metadata to AppGrid', () => {
    const messages = [
      { timestamp: Date.now() - 2000, logType: 'error' },
      { timestamp: Date.now() - 500, logType: 'warn' },
    ].map((msg, ix) => {
      const exampleInfoEventOptions = getLogEventOptions(
        `This is batched entry #${ix + 1} with Metadata !`,
        logFacilityCode
      );
      return Object.assign(exampleInfoEventOptions, msg, {
        metadata: "Hey, I'm some metadata",
      });
    });

    return client.sendLogs(messages).then(response => {
      expect(response.status).toBe(okStatus);
    });
  });
});
