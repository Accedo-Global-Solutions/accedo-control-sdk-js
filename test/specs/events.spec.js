require('../fakeNetworkCalls');
const factory = require('../../src/index');

const okStatus = 200;

describe('Events API Tests', () => {
  const client = factory({
    appKey: '56ea6a370db1bf032c9df5cb',
    deviceId: 'gregTestingSDK',
  });

  test('sendUsageStartEvent should successfully send a usage start event to AppGrid', () => {
    return client.sendUsageStartEvent().then(({ status }) => {
      expect(status).toBe(okStatus);
    });
  });

  test('sendUsageStopEvent should successfully send a usage stop event to AppGrid after 3 seconds', () => {
    const rententionTimeInSeconds = 3;

    return client
      .sendUsageStopEvent(rententionTimeInSeconds)
      .then(({ status }) => {
        expect(status).toBe(okStatus);
      });
  });
});
