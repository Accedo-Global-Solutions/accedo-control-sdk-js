/* eslint-disable no-unused-expressions */

import chai from 'chai';
import AppGrid from '../../dist/index.js';

import appGridOptions from '../appGridOptions';

chai.should();

describe('Metadata API Tests', () => {
  it('The API should exist and contain the expected functions', () => {
    AppGrid.metadata.should.be.an('object');
    AppGrid.metadata.getAllMetadata.should.be.a('function');
    AppGrid.metadata.getMetadataByKey.should.be.a('function');
    AppGrid.metadata.getMetadataByKeys.should.be.a('function');
  });

  it('"getAllMetadata" should return at least one item from AppGrid', (done) => {
    AppGrid.metadata.getAllMetadata(appGridOptions)
      .then(({ json: metadata }) => {
        Object.keys(metadata).length.should.be.greaterThan(0);
        done();
      });
  });

  it('"getMetadataByKey" should return a valid metadata item', (done) => {
    const keyToFetch = 'android';
    AppGrid.metadata.getMetadataByKey(appGridOptions, keyToFetch)
      .then(({ json: metadata }) => {
        metadata.should.be.ok;
        metadata.should.have.property(keyToFetch);
        done();
      });
  });

  it('"getMetadataByKeys" should return valid metadata items', (done) => {
    const keysToFetch = [
      'android',
      'colorScheme'
    ];
    AppGrid.metadata.getMetadataByKeys(appGridOptions, keysToFetch)
      .then(({ json: metadata }) => {
        metadata.should.be.ok;
        keysToFetch.forEach((key) => metadata.should.have.property(key));
        done();
      });
  });
});
