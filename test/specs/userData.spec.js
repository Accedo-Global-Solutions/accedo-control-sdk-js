const factory = require('../../src/node/index');

const okStatus = 200;
const userName = 'exampleUser';
const dataKeyToRequest = 'name';
const dataKeyToSet = 'packageName';
const dataValueToSet = 'platinum';
const userProfileData = {
  name: 'Johnny AccedoOneUser',
  email: 'johnny.accedooneuser@email.com',
  favoriteVideoIds: ['abc123', '321abc', 'cba321'],
};

describe('UserData API Tests', () => {
  const client = factory({
    appKey: '56ea6a370db1bf032c9df5cb',
    deviceId: 'gregTestingSDK',
    // log: (...args) => console.log(...args)
  });

  test('setApplicationScopeUserData should return an OK status', () => {
    return client
      .setApplicationScopeUserData(userName, userProfileData)
      .then(({ status }) => {
        expect(status).toBe(okStatus);
      });
  });

  test('setApplicationGroupScopeUserData should return an OK status', () => {
    return client
      .setApplicationGroupScopeUserData(userName, userProfileData)
      .then(({ status }) => {
        expect(status).toBe(okStatus);
      });
  });

  test('getAllApplicationScopeDataByUser should return the expected UserData Profile', () => {
    return client.getAllApplicationScopeDataByUser(userName).then(userData => {
      expect(userData).toBeTruthy();
      expect(userData.name).toBe(userProfileData.name);
      expect(userData.email).toBe(userProfileData.email);
    });
  });

  test('getAllApplicationGroupScopeDataByUser should the expected UserData Profile', () => {
    return client
      .getAllApplicationGroupScopeDataByUser(userName)
      .then(userData => {
        expect(userData).toBeTruthy();
        expect(userData.name).toBe(userProfileData.name);
        expect(userData.email).toBe(userProfileData.email);
      });
  });

  test('setApplicationScopeUserDataByKey should return an OK status', () => {
    return client
      .setApplicationScopeUserDataByKey(userName, dataKeyToSet, dataValueToSet)
      .then(({ status }) => {
        expect(status).toBe(okStatus);
      });
  });

  test('setApplicationGroupScopeUserDataByKey should return an OK status', () => {
    return client
      .setApplicationGroupScopeUserDataByKey(
        userName,
        dataKeyToSet,
        dataValueToSet
      )
      .then(({ status }) => {
        expect(status).toBe(okStatus);
      });
  });

  test('getApplicationScopeDataByUserAndKey should return an OK status', () => {
    return client
      .getApplicationScopeDataByUserAndKey(userName, dataKeyToRequest)
      .then(userData => {
        expect(userData).toBeTruthy();
        expect(userData[dataKeyToRequest]).toBe(
          userProfileData[dataKeyToRequest]
        );
      });
  });

  test('getApplicationGroupScopeDataByUserAndKey should return an OK status', () => {
    return client
      .getApplicationGroupScopeDataByUserAndKey(userName, dataKeyToRequest)
      .then(userData => {
        expect(userData).toBeTruthy();
        expect(userData[dataKeyToRequest]).toBe(
          userProfileData[dataKeyToRequest]
        );
      });
  });
});
