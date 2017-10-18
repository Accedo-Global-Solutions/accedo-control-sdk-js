const factory = require('../../src/node/index');

describe('Application API Tests', () => {
  const client = factory({
    appKey: '56ea6a370db1bf032c9df5cb',
    deviceId: 'gregTestingSDK',
  });

  test('getStatus should return the status of Accedo One', () => {
    return client.getApplicationStatus().then(({ status }) => {
      expect(status).toBeTruthy();
    });
  });
});
