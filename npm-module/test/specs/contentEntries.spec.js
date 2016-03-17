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

  it('"getEntryById" should should return an entry', (done) => {
    const idToFetch = '56ea7bd6935f75032a2fd431';
    const isPreview = false;
    const atUtcTime = new Date();
    AppGrid.contentEntries.getEntryById(appGridOptions, idToFetch, isPreview, atUtcTime)
      .then(({ json: entry }) => {
        entry.should.be.ok;
        entry._meta.id.should.equal(idToFetch);
        done();
      });
  });

  it('"getEntriesByIds" should should return multiple entries', (done) => {
    const idsToFetch = [
      '56ea7bd6935f75032a2fd431',
      '56ea7c55935f75032a2fd437'
    ];
    const isPreview = false;
    const atUtcTime = new Date();
    AppGrid.contentEntries.getEntriesByIds(appGridOptions, idsToFetch, paginationOptions.offset, paginationOptions.countOfResults, isPreview, atUtcTime)
      .then(({ json: { entries } }) => {
        entries.length.should.be.equal(idsToFetch.length);
        done();
      });
  });

  it('"getEntriesByTypeId" should should return multiple entries', (done) => {
    const typeIdToFetch = '56ea7bca935f75032a2fd42c';
    const isPreview = false;
    const atUtcTime = new Date();
    AppGrid.contentEntries.getEntriesByTypeId(appGridOptions, typeIdToFetch, paginationOptions.offset, paginationOptions.countOfResults, isPreview, atUtcTime)
      .then(({ json: { entries } }) => {
        entries.length.should.be.greaterThan(0);
        done();
      });
  });
});
