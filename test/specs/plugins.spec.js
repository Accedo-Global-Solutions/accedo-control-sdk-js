const factory = require('../../src/index');

describe('Plugins API Tests', () => {
  const client = factory({
    appKey: '56ea6a370db1bf032c9df5cb',
    deviceId: 'gregTestingSDK'
  });

  test('getAllEnabledPlugins should return an array from AppGrid', () => {
    return client.getAllEnabledPlugins()
      .then((plugins) => {
        expect(Array.isArray(plugins)).toBe(true);
      });
  });
});
