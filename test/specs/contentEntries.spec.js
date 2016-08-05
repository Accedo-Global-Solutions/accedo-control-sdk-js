import chai from 'chai';
import AppGrid from '../../src/index';

import appGridOptions from '../appGridOptions';

chai.should();

const paginationOptions = {
  offset: 0,
  size: 50
};

describe('ContentEntries API Tests', () => {
  it('The API should exist and contain the expected functions', () => {
    AppGrid.contentEntries.should.be.an('object');
    AppGrid.contentEntries.getEntryById.should.be.a('function');
    AppGrid.contentEntries.getEntries.should.be.a('function');
  });

  it('"getEntryById" should return an entry', (done) => {
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

  it('"getEntries" should return at least one entry', (done) => {
    const { offset, size } = paginationOptions;
    AppGrid.contentEntries.getEntries(appGridOptions, { offset, size })
      .then(({ json: { entries } }) => {
        entries.length.should.be.greaterThan(0);
        done();
      });
  });

  it('"getEntries" with the id param should return multiple entries', (done) => {
    const params = {
      ...paginationOptions,
      id: ['56ea7bd6935f75032a2fd431', '56ea7c55935f75032a2fd437'],
      preview: false,
      at: new Date()
    };
    AppGrid.contentEntries.getEntries(appGridOptions, params)
      .then(({ json: { entries } }) => {
        entries.length.should.be.equal(params.id.length);
        done();
      });
  });

  it('"getEntries" with the typeId param should return multiple entries', (done) => {
    const params = {
      ...paginationOptions,
      typeId: '56ea7bca935f75032a2fd42c',
      at: new Date()
    };
    AppGrid.contentEntries.getEntries(appGridOptions, params)
      .then(({ json: { entries } }) => {
        entries.length.should.be.greaterThan(0);
        done();
      });
  });
});
