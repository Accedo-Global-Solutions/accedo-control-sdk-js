import chai from 'chai';
import factory from '../../src/index';

chai.should();

describe('Assets API Tests', () => {
  const client = factory({
    appKey: '56ea6a370db1bf032c9df5cb',
    deviceId: 'gregTestingSDK',
    // log(...args) { console.log(...args); }
  });

  it('getAllAssets should should return at least one asset', () => {
    return client.getAllAssets()
      .then((assets) => {
        Object.keys(assets).length.should.be.greaterThan(0);
      });
  });
});
