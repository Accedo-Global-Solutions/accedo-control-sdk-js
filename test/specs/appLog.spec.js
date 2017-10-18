require('../fakeNetworkCalls');
const factory = require('../../src/node/index');

const okStatus = 200;

const nightOrDay = () => {
  const hour = new Date().getHours();
  // NOTE: These strings are expected by Accedo One
  switch (true) {
    case hour < 5 || hour > 17:
      return 'night';
    default:
      return 'day';
  }
};

// NOTE: This is simply a convenience/helper method for building a logEvent object.
const getLogEventOptions = message => {
  const networkErrorCode = '13002';
  const middlewareSourceCode = 'service-mw';
  const noneViewName = 'sdk_unit_test';
  const deviceType = 'desktop';
  return {
    message,
    errorCode: networkErrorCode,
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

  const p1 = client.getLogLevel();
  const p2 = client.getLogLevel();

  test('getLogLevel returns the same promise when called twice before it yields a result', () => {
    expect(p1).toBe(p2);
  });

  test('getLogLevel should yield a string', () => {
    return p1.then(logLevel => {
      expect(typeof logLevel).toBe('string');
    });
  });

  test('sendLog should successfully send a log-message to Accedo One for each log-level', () => {
    const promises = ['debug', 'info', 'warn', 'error'].map(level => {
      const exampleInfoEventOptions = getLogEventOptions(
        `This is a ${level} entry!`
      );
      return client.sendLog(level, exampleInfoEventOptions).then(response => {
        // NOTE: for some reason: debug results in an undefined response from Accedo One
        if (!response && level === 'debug') {
          return;
        }
        expect(response.status).toBe(okStatus);
      });
    });
    return Promise.all(promises);
  });

  test('sendLog should successfully send a log-message with Metadata to Accedo One for each log-level', () => {
    const promises = ['debug', 'info', 'warn', 'error'].map(level => {
      const exampleInfoEventOptions = getLogEventOptions(
        `This is a new ${level} entry with Metadata!`
      );
      const exampleMetadata = { someMetadataKey: 'someValue' };
      return client
        .sendLog(level, exampleInfoEventOptions, exampleMetadata)
        .then(response => {
          // NOTE: for some reason: debug results in an undefined response from Accedo One
          if (!response && level === 'debug') {
            return;
          }
          expect(response.status).toBe(okStatus);
        });
    });
    return Promise.all(promises);
  });

  test('sendLogs should successfully send batched logs with Metadata to Accedo One', () => {
    const messages = [
      { timestamp: Date.now() - 2000, logType: 'error' },
      { timestamp: Date.now() - 500, logType: 'warn' },
    ].map((msg, ix) => {
      const exampleInfoEventOptions = getLogEventOptions(
        `This is batched entry #${ix + 1} with Metadata !`
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

/* eslint-disable global-require */
describe('The environment-specific code for appLogs', () => {
  const appLogNode = require('../../src/stamps/node/appLog');
  const appLogBrowser = require('../../src/stamps/browser/appLog');

  test('Exposes the same method names on browsers and Node', () => {
    expect(Object.keys(appLogNode)).toEqual(Object.keys(appLogBrowser));
  });
});
