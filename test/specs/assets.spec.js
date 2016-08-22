import chai from 'chai';
import factory from '../../src';

chai.should();

describe('Assets API Tests', () => {
  const client = factory({
    appKey: '56ea6a370db1bf032c9df5cb',
    uuid: 'gregTestingSDK'
  });

  it('getAllAssets should should return at least one asset', () => {
    return client.getAllAssets()
      .then((assets) => {
        Object.keys(assets).length.should.be.greaterThan(0);
      });
  });

  it('getAssetStreamById should return a valid stream for a valid assetId', () => {
    const idToDownload = '5566eeaa669ad3b700ddbb11bbff003322cc99ddff55bc7b';
    return client.getAssetStreamById(idToDownload)
      .then((assetStream) => {
        assetStream.should.be.ok;
        assetStream.pipe.should.be.a('function');
      });
  });
});
