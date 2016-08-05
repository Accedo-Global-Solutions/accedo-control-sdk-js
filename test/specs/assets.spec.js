import chai from 'chai';
import AppGrid from '../../src/index';

import appGridOptions from '../appGridOptions';

chai.should();

describe('Assets API Tests', () => {
  it('The API should exist and contain the expected functions', () => {
    AppGrid.assets.should.be.an('object');
    AppGrid.assets.getAllAssets.should.be.a('function');
    AppGrid.assets.getAssetStreamById.should.be.a('function');
  });

  it('"getAllAssets" should should return at least one asset', (done) => {
    AppGrid.assets.getAllAssets(appGridOptions)
      .then(({ json: assets }) => {
        Object.keys(assets).length.should.be.greaterThan(0);
        done();
      });
  });

  it('"getAssetStreamById" should should return a valid stream for a valid assetId', (done) => {
    const idToDownload = '5566eeaa669ad3b700ddbb11bbff003322cc99ddff55bc7b';
    AppGrid.assets.getAssetStreamById(idToDownload, appGridOptions)
      .then((assetStream) => {
        assetStream.should.be.ok;
        assetStream.pipe.should.be.a('function');
        done();
      });
  });
});
