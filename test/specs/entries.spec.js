import chai from 'chai';
import factory from '../../src/index';

chai.should();

const paginationOptions = {
  offset: 0,
  size: 50
};

describe('Entries API Tests', () => {
  const client = factory({
    appKey: '56ea6a370db1bf032c9df5cb',
    deviceId: 'gregTestingSDK',
    // log(...args) { console.log(...args); },
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
    const params = Object.assign({}, paginationOptions, {
      id: ['56ea7bd6935f75032a2fd431', '56ea7c55935f75032a2fd437'],
      preview: false,
      at: new Date()
    });
    return client.getEntries(params)
      .then(({ entries }) => {
        entries.length.should.be.equal(params.id.length);
      });
  });

  it('"getEntries" with the typeId param should return multiple entries', () => {
    const params = Object.assign({}, paginationOptions, {
      typeId: ['56ea7bca935f75032a2fd42c'],
      at: new Date()
    });
    return client.getEntries(params)
      .then(({ entries }) => {
        entries.length.should.be.greaterThan(0);
      });
  });

  it('"getEntries" with the typeId param for multiple typeIds should perform a request too', () => {
    const paramsArray = Object.assign({}, paginationOptions, {
      typeId: ['56ea7bca935f75032a2fd42c', '56ea7bca935f75032a2fd42c'],
    });
    return client.getEntries(paramsArray)
      .then(({ entries }) => {
        entries.length.should.be.greaterThan(0);
      });
  });

  it('"getEntries" with the alias param should return multiple entries, all with the given alias', () => {
    const aliases = ['greg', 'erik'];
    const params = Object.assign({}, paginationOptions, {
      alias: aliases
    });
    return client.getEntries(params)
      .then(({ entries }) => {
        entries.length.should.be.greaterThan(0);
        entries.some(e => !aliases.includes(e._meta.entryAlias)).should.equal(false);
      });
  });

  it('"getEntries" with the typeAlias param should return multiple entries, all with the given typeAlias', () => {
    const typeAlias = 'exampleentrytype';
    const params = Object.assign({}, paginationOptions, {
      typeAlias,
    });
    return client.getEntries(params)
      .then(({ entries }) => {
        entries.length.should.be.greaterThan(0);
        entries.some(e => typeAlias !== e._meta.typeAlias).should.equal(false);
      });
  });
});
