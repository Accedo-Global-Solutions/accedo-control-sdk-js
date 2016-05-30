/* eslint-disable no-unused-expressions */

import chai from 'chai';
import AppGrid from '../../src/index';

import appGridOptions from '../appGridOptions';

chai.should();

describe('Profile API Tests', () => {
  it('The API should exist and contain the expected functions', () => {
    AppGrid.profile.should.be.an('object');
    AppGrid.profile.getProfileInfo.should.be.a('function');
  });

  it('"getProfileInfo" should at least return a profile id and a profile name', (done) => {
    AppGrid.profile.getProfileInfo(appGridOptions)
      .then(({ json: profileInfo }) => {
        profileInfo.should.be.ok;
        profileInfo.should.have.property('profileId');
        profileInfo.should.have.property('profileName');
        done();
      });
  });
});
