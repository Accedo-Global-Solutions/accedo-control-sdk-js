require('../fakeNetworkCalls');
const factory = require('../../src/index');
const apiHelper = require('../../src/apiHelper');

// By default, Jest creates an environment that is browser-like

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

const levels = ['debug', 'info', 'warn', 'error'];
const sendOneLogOfEach = client =>
  Promise.all(
    levels.map(level =>
      client.sendLog(level, getLogEventOptions('just a test', 88))
    )
  );

const makeClient = () =>
  factory({
    appKey: '56ea6a370db1bf032c9df5cb',
    deviceId: 'gregTestingSDK',
    // log(...args) { console.log(...args); },
  });

describe('Logging API, using a browser', () => {
  test('sendLog should trigger a call to getLogLevel', () => {
    const client = makeClient();
    const logLevelSpy = jest.spyOn(client, 'getLogLevel');
    return client
      .sendLog('error', getLogEventOptions('just a test', 88))
      .then(() => {
        expect(logLevelSpy.mock.calls.length).toBe(1);
        logLevelSpy.mockRestore();
      });
  });

  test('with `error` level, only one log will actually be posted', () => {
    const client = makeClient();

    apiHelper.__changeMaps({ '/application/log/level': { logLevel: 'error' } });

    return sendOneLogOfEach(client).then(allResults => {
      expect(allResults.filter(res => res.requestAvoided).length).toBe(3);
    });
  });

  test('with `warn` level, 2 logs will actually be posted', () => {
    const client = makeClient();

    apiHelper.__changeMaps({ '/application/log/level': { logLevel: 'warn' } });

    return sendOneLogOfEach(client).then(allResults => {
      expect(allResults.filter(res => res.requestAvoided).length).toBe(2);
    });
  });

  test('with `info` level, 3 logs will actually be posted', () => {
    const client = makeClient();

    apiHelper.__changeMaps({ '/application/log/level': { logLevel: 'info' } });

    return sendOneLogOfEach(client).then(allResults => {
      expect(allResults.filter(res => res.requestAvoided).length).toBe(1);
    });
  });

  test('with `debug` level, all 4 logs will actually be posted', () => {
    const client = makeClient();

    apiHelper.__changeMaps({ '/application/log/level': { logLevel: 'debug' } });

    return sendOneLogOfEach(client).then(allResults => {
      expect(allResults.filter(res => res.requestAvoided).length).toBe(0);
    });
  });

  test('with `off` level, no log will actually be posted', () => {
    const client = makeClient();

    apiHelper.__changeMaps({ '/application/log/level': { logLevel: 'off' } });

    return sendOneLogOfEach(client).then(allResults => {
      expect(allResults.filter(res => res.requestAvoided).length).toBe(4);
    });
  });
});
