const factory = require('../../src/index');

describe('Application API Tests', () => {
  const client = factory({
    appKey: '56ea6a370db1bf032c9df5cb',
    deviceId: 'gregTestingSDK',
  });

  test('getStatus should return the status of AppGrid', () => {
    return client.getApplicationStatus().then(({ status }) => {
      expect(status).toBeTruthy();
    });
  });
});
