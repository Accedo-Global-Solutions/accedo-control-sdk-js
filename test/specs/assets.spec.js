const factory = require('../../src/node/index');

describe('Assets API Tests', () => {
  const client = factory({
    appKey: '56ea6a370db1bf032c9df5cb',
    deviceId: 'gregTestingSDK',
    // log(...args) { console.log(...args); }
  });

  test('getAllAssets should return at least one asset', () => {
    return client.getAllAssets().then(assets => {
      expect(Object.keys(assets).length).toBeGreaterThan(0);
    });
  });
});
