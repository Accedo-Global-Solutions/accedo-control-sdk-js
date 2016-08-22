import chai from 'chai';
import factory from '../../src';

chai.should();

const okStatus = 200;
const userName = 'exampleUser';
const dataKeyToRequest = 'name';
const dataKeyToSet = 'packageName';
const dataValueToSet = 'platinum';
const userProfileData = {
  name: 'Johnny AppGridUser',
  email: 'johnny.appgriduser@email.com',
  favoriteVideoIds: [
    'abc123',
    '321abc',
    'cba321'
  ]
};

describe('UserData API Tests', () => {
  const client = factory({
    appKey: '56ea6a370db1bf032c9df5cb',
    uuid: 'gregTestingSDK',
    // log: (...args) => console.log(...args)
  });

  it('setApplicationScopeUserData should return an OK status from AppGrid', () => {
    return client.setApplicationScopeUserData(userName, userProfileData)
      .then(({ status }) => {
        status.should.equal(okStatus);
      });
  });

  it('setApplicationGroupScopeUserData should return an OK status from AppGrid', () => {
    return client.setApplicationGroupScopeUserData(userName, userProfileData)
      .then(({ status }) => {
        status.should.equal(okStatus);
      });
  });

  it('getAllApplicationScopeDataByUser should return the expected UserData Profile from AppGrid', () => {
    return client.getAllApplicationScopeDataByUser(userName)
      .then((userData) => {
        userData.should.be.ok;
        userData.name.should.equal(userProfileData.name);
        userData.email.should.equal(userProfileData.email);
      });
  });

  it('getAllApplicationGroupScopeDataByUser should the expected UserData Profile from AppGrid', () => {
    return client.getAllApplicationGroupScopeDataByUser(userName)
      .then((userData) => {
        userData.should.be.ok;
        userData.name.should.equal(userProfileData.name);
        userData.email.should.equal(userProfileData.email);
      });
  });

  it('setApplicationScopeUserDataByKey should return an OK status from AppGrid', () => {
    return client.setApplicationScopeUserDataByKey(userName, dataKeyToSet, dataValueToSet)
      .then(({ status }) => {
        status.should.equal(okStatus);
      });
  });

  it('setApplicationGroupScopeUserDataByKey should return an OK status from AppGrid', () => {
    return client.setApplicationGroupScopeUserDataByKey(userName, dataKeyToSet, dataValueToSet)
      .then(({ status }) => {
        status.should.equal(okStatus);
      });
  });

  it('getApplicationScopeDataByUserAndKey should return an OK status from AppGrid', () => {
    return client.getApplicationScopeDataByUserAndKey(userName, dataKeyToRequest)
      .then((userData) => {
        userData.should.be.ok;
        userData[dataKeyToRequest].should.equal(userProfileData[dataKeyToRequest]);
      });
  });

  it('getApplicationGroupScopeDataByUserAndKey should return an OK status from AppGrid', () => {
    return client.getApplicationGroupScopeDataByUserAndKey(userName, dataKeyToRequest)
      .then((userData) => {
        userData.should.be.ok;
        userData[dataKeyToRequest].should.equal(userProfileData[dataKeyToRequest]);
      });
  });
});
