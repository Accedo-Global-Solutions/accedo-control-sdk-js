import chai from 'chai';
import clientStamp from '../../src/client';

chai.should();

const paginationOptions = {
  offset: 0,
  size: 50
};

describe('Entries API Tests', () => {
  const client = clientStamp({
    appKey: '56ea6a370db1bf032c9df5cb',
    uuid: 'gregTestingSDK'
  });

  it('The API should exist and contain the expected functions', () => {
    client.getEntryById.should.be.a('function');
    client.getEntryByAlias.should.be.a('function');
    client.getEntries.should.be.a('function');
  });

  it('"getEntryById" should return an entry', () => {
    const idToFetch = '56ea7bd6935f75032a2fd431';
    const isPreview = false;
    const atUtcTime = new Date();
    return client.getEntryById(idToFetch, { isPreview, atUtcTime })
      .then((entry) => {
        entry.should.be.ok;
        entry._meta.id.should.equal(idToFetch);
      });
  });

  it('"getEntryByAlias" should return an entry', () => {
    const alias = 'greg';
    return client.getEntryByAlias(alias)
      .then((entry) => {
        entry.should.be.ok;
        entry._meta.entryAlias.should.equal(alias);
      });
  });

  it('"getEntries" should return at least one entry', () => {
    const { offset, size } = paginationOptions;
    return client.getEntries({ offset, size })
      .then(({ entries }) => {
        entries.length.should.be.greaterThan(0);
      });
  });

  it('"getEntries" with the id param should return multiple entries', () => {
    const params = {
      ...paginationOptions,
      id: ['56ea7bd6935f75032a2fd431', '56ea7c55935f75032a2fd437'],
      preview: false,
      at: new Date()
    };
    return client.getEntries(params)
      .then(({ entries }) => {
        entries.length.should.be.equal(params.id.length);
      });
  });

  it('"getEntries" with the typeId param should return multiple entries', () => {
    const params = {
      ...paginationOptions,
      typeId: '56ea7bca935f75032a2fd42c',
      at: new Date()
    };
    return client.getEntries(params)
      .then(({ entries }) => {
        entries.length.should.be.greaterThan(0);
      });
  });

  it('"getEntries" with the alias param should return multiple entries', () => {
    const params = {
      ...paginationOptions,
      alias: ['greg', 'erik']
    };
    return client.getEntries(params)
      .then(({ entries }) => {
        entries.length.should.be.greaterThan(0);
      });
  });
});
