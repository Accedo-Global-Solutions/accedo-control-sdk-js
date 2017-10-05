const factory = require('../../src/index');

describe('Metadata API Tests', () => {
  const client = factory({
    appKey: '56ea6a370db1bf032c9df5cb',
    deviceId: 'gregTestingSDK'
  });

  test('getAllMetadata should return at least one item from AppGrid', () => {
    return client.getAllMetadata()
      .then((metadata) => {
        expect(Object.keys(metadata).length).toBeGreaterThan(0);
      });
  });

  test('getMetadataByKey should return a valid metadata item', () => {
    const key = 'android';
    return client.getMetadataByKey(key)
      .then((metadata) => {
        expect(metadata).toBeTruthy();
        expect(metadata).toHaveProperty(key);
      });
  });

  test('getMetadataByKeys should return valid metadata items', () => {
    const keys = [
      'android',
      'colorScheme'
    ];
    return client.getMetadataByKeys(keys)
      .then((metadata) => {
        expect(metadata).toBeTruthy();
        keys.forEach((key) => expect(metadata).toHaveProperty(key));
      });
  });
});
