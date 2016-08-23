import chai from 'chai';
import factory from '../../src/index';

chai.should();

describe('Plugins API Tests', () => {
  const client = factory({
    appKey: '56ea6a370db1bf032c9df5cb',
    deviceId: 'gregTestingSDK'
  });

  it('getAllEnabledPlugins should return an array from AppGrid', () => {
    return client.getAllEnabledPlugins()
      .then((plugins) => {
        plugins.should.be.an('array');
      });
  });
});
