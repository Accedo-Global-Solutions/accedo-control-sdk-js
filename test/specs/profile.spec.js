const factory = require('../../src/node/index');

describe('Profile API Tests', () => {
  const client = factory({
    appKey: '56ea6a370db1bf032c9df5cb',
    deviceId: 'gregTestingSDK',
  });

  test('getProfileInfo should at least return a profile id and a profile name', () => {
    return client.getProfileInfo().then(profileInfo => {
      expect(profileInfo).toHaveProperty('profileId');
      expect(profileInfo).toHaveProperty('profileName');
    });
  });
});
