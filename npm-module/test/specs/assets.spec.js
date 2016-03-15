/* eslint-disable no-unused-expressions */

import chai from 'chai';
import AppGrid from '../../dist/index.js';

import appGridOptions from '../appGridOptions';

chai.should();

describe('Assets API Tests', () => {
  it('The API should exist and contain the expected functions', () => {
    AppGrid.assets.should.be.a('object');
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
    const idToDownload = '5566b04e95a0d55dee44bb0001a5109c7b9be597f66ddfd5'; // TODO: Update this assetId to one from the TBD AppGrid Example Profile
    AppGrid.assets.getAssetStreamById(idToDownload, appGridOptions)
      .then((assetStream) => {
        assetStream.should.be.ok;
        assetStream.pipe.should.be.a('function');
        done();
      });
  });
});
