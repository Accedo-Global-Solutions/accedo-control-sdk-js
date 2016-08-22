import chai from 'chai';
import factory from '../../src/index';

chai.should();

describe('Profile API Tests', () => {
  const client = factory({
    appKey: '56ea6a370db1bf032c9df5cb',
    uuid: 'gregTestingSDK'
  });

  it('getProfileInfo should at least return a profile id and a profile name', () => {
    return client.getProfileInfo()
      .then((profileInfo) => {
        profileInfo.should.have.property('profileId');
        profileInfo.should.have.property('profileName');
      });
  });
});
