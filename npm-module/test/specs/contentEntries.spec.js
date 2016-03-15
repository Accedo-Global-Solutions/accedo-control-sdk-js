/* eslint-disable no-unused-expressions */

import chai from 'chai';
import AppGrid from '../../dist/index.js';

import appGridOptions from '../appGridOptions';

chai.should();

const paginationOptions = {
  offset: 0,
  countOfResults: 50
};

describe('ContentEntries API Tests', () => {
  it('The API should exist and contain the expected functions', () => {
    AppGrid.contentEntries.should.be.an('object');
    AppGrid.contentEntries.getAllEntries.should.be.a('function');
    AppGrid.contentEntries.getEntryById.should.be.a('function');
    AppGrid.contentEntries.getEntriesByIds.should.be.a('function');
    AppGrid.contentEntries.getEntriesByTypeId.should.be.a('function');
  });

  it('"getAllEntries" should should return at least one entry', (done) => {
    AppGrid.contentEntries.getAllEntries(appGridOptions, paginationOptions.offset, paginationOptions.countOfResults)
      .then(({ json: { entries } }) => {
        entries.length.should.be.greaterThan(0);
        done();
      });
  });

  it('"getEntryById" should should return a valid stream for a valid assetId', (done) => {
    const idToFetch = '56c1de17e4b0b8a18ac01632'; // TODO: Update this contentEntryId to one from the TBD AppGrid Example Profile
    const isPreview = false;
    const atUtcTime = new Date();
    AppGrid.contentEntries.getEntryById(appGridOptions, idToFetch, isPreview, atUtcTime)
      .then(({ json: entry }) => {
        entry.should.be.ok;
        entry._meta.id.should.equal(idToFetch);
        done();
      });
  });

  it('"getEntriesByIds" should should return a valid stream for a valid assetId', (done) => {
    const idsToFetch = [ // TODO: Update these contentEntryIds to ones from the TBD AppGrid Example Profile
      '56c1de17e4b0b8a18ac01632',
      '55b8ec42e4b0161a1b30c041'
    ];
    const isPreview = false;
    const atUtcTime = new Date();
    AppGrid.contentEntries.getEntriesByIds(appGridOptions, idsToFetch, paginationOptions.offset, paginationOptions.countOfResults, isPreview, atUtcTime)
      .then(({ json: { entries } }) => {
        entries.length.should.be.equal(idsToFetch.length);
        done();
      });
  });

  it('"getEntriesByIds" should should return a valid stream for a valid assetId', (done) => {
    const typeIdToFetch = '55d6fb35e4b09adc64cd6ad2'; // TODO: Update this contentEntryTypeId to one from the TBD AppGrid Example Profile
    const isPreview = false;
    const atUtcTime = new Date();
    AppGrid.contentEntries.getEntriesByTypeId(appGridOptions, typeIdToFetch, paginationOptions.offset, paginationOptions.countOfResults, isPreview, atUtcTime)
      .then(({ json: { entries } }) => {
        entries.length.should.be.greaterThan(0);
        done();
      });
  });
});
