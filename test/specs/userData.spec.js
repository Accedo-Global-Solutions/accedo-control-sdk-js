import chai from 'chai';
import AppGrid from '../../src/index';

import appGridOptions from '../appGridOptions';

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
  it('The API should exist and contain the expected functions', () => {
    AppGrid.userData.should.be.an('object');
    AppGrid.userData.setApplicationScopeUserData.should.be.a('function');
    AppGrid.userData.setApplicationGroupScopeUserData.should.be.a('function');
    AppGrid.userData.setApplicationScopeUserDataByKey.should.be.a('function');
    AppGrid.userData.setApplicationGroupScopeUserDataByKey.should.be.a('function');
    AppGrid.userData.getAllApplicationScopeDataByUser.should.be.a('function');
    AppGrid.userData.getAllApplicationGroupScopeDataByUser.should.be.a('function');
    AppGrid.userData.getApplicationScopeDataByUserAndKey.should.be.a('function');
    AppGrid.userData.getApplicationGroupScopeDataByUserAndKey.should.be.a('function');
  });

  it('"setApplicationScopeUserData" should return an OK status from AppGrid', (done) => {
    AppGrid.userData.setApplicationScopeUserData(appGridOptions, userName, userProfileData)
      .then(({ status }) => {
        status.should.equal(okStatus);
        done();
      });
  });

  it('"setApplicationGroupScopeUserData" should return an OK status from AppGrid', (done) => {
    AppGrid.userData.setApplicationGroupScopeUserData(appGridOptions, userName, userProfileData)
      .then(({ status }) => {
        status.should.equal(okStatus);
        done();
      });
  });

  it('"getAllApplicationScopeDataByUser" should return the expected UserData Profile from AppGrid', (done) => {
    AppGrid.userData.getAllApplicationScopeDataByUser(appGridOptions, userName)
      .then(({ json: userData }) => {
        userData.should.be.ok;
        // NOTE: For some reason, Chai's deep.equal assertion is not working here, so we have to manually compare fields
        userData.name.should.equal(userProfileData.name);
        userData.email.should.equal(userProfileData.email);
        done();
      });
  });

  it('"getAllApplicationGroupScopeDataByUser" should the expected UserData Profile from AppGrid', (done) => {
    AppGrid.userData.getAllApplicationGroupScopeDataByUser(appGridOptions, userName)
      .then(({ json: userData }) => {
        userData.should.be.ok;
        // NOTE: For some reason, Chai's deep.equal assertion is not working here, so we have to manually compare fields
        userData.name.should.equal(userProfileData.name);
        userData.email.should.equal(userProfileData.email);
        done();
      });
  });

  it('"setApplicationScopeUserDataByKey" should return an OK status from AppGrid', (done) => {
    AppGrid.userData.setApplicationScopeUserDataByKey(appGridOptions, userName, dataKeyToSet, dataValueToSet)
      .then(({ status }) => {
        status.should.equal(okStatus);
        done();
      });
  });

  it('"setApplicationGroupScopeUserDataByKey" should return an OK status from AppGrid', (done) => {
    AppGrid.userData.setApplicationGroupScopeUserDataByKey(appGridOptions, userName, dataKeyToSet, dataValueToSet)
      .then(({ status }) => {
        status.should.equal(okStatus);
        done();
      });
  });

  it('"getApplicationScopeDataByUserAndKey" should return an OK status from AppGrid', (done) => {
    AppGrid.userData.getApplicationScopeDataByUserAndKey(appGridOptions, userName, dataKeyToRequest)
      .then(({ json: userData }) => {
        userData.should.be.ok;
        userData[dataKeyToRequest].should.equal(userProfileData[dataKeyToRequest]);
        done();
      });
  });

  it('"getApplicationGroupScopeDataByUserAndKey" should return an OK status from AppGrid', (done) => {
    AppGrid.userData.getApplicationGroupScopeDataByUserAndKey(appGridOptions, userName, dataKeyToRequest)
      .then(({ json: userData }) => {
        userData.should.be.ok;
        userData[dataKeyToRequest].should.equal(userProfileData[dataKeyToRequest]);
        done();
      });
  });
});
