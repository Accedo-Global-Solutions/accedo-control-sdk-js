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

  it('getAssetById should return a valid stream for a valid assetId', () => {
    const idToDownload = '56ea69db0db1bf032c9df5b5';
    return client.getAssetById(idToDownload)
      .then((assetStream) => {
        assetStream.should.be.ok;
        assetStream.pipe.should.be.a('function');
      });
  });
});
