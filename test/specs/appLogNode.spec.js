require('../fakeNetworkCalls');

// Pretend we're on Node (which we are, but Jest makes it look like it's a browser)
const factory = require('../../src/node/index');

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

describe('Logging API, using Node.js', () => {
  const client = factory({
    appKey: '56ea6a370db1bf032c9df5cb',
    deviceId: 'gregTestingSDK',
    // log(...args) { console.log(...args); },
  });

  test('on non-browser environment, sendLog should not trigger a call to getLogLevel', () => {
    const logLevelSpy = jest.spyOn(client, 'getLogLevel');
    return client
      .sendLog('error', getLogEventOptions('just a test', 88))
      .then(() => {
        expect(logLevelSpy.mock.calls.length).toBe(0);
      });
  });
});
