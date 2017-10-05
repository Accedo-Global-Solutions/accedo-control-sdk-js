const factory = require('../../src/index');

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

  test('The API should exist and contain the expected functions', () => {
    expect(typeof client.getEntryById).toBe('function');
    expect(typeof client.getEntryByAlias).toBe('function');
    expect(typeof client.getEntries).toBe('function');
  });

  test('"getEntryById" should return an entry', () => {
    const idToFetch = '56ea7bd6935f75032a2fd431';
    const isPreview = false;
    const atUtcTime = new Date();
    return client.getEntryById(idToFetch, { isPreview, atUtcTime })
      .then((entry) => {
        expect(entry).toBeTruthy();
        expect(entry._meta.id).toBe(idToFetch);
      });
  });

  test('"getEntryByAlias" should return an entry', () => {
    const alias = 'greg';
    return client.getEntryByAlias(alias)
      .then((entry) => {
        expect(entry).toBeTruthy();
        expect(entry._meta.entryAlias).toBe(alias);
      });
  });

  test(
    'using the locale option should return a localized entry when available',
    () => {
      const alias = 'erik';
      return Promise.all([
        client.getEntryByAlias(alias, { locale: 'fr' }),
        client.getEntryByAlias(alias, { locale: 'en' }),
        // client.getEntryByAlias(alias, { locale: 'es' }),
      ])
        .then(([fr, en]) => {
          expect(fr.hello).toBe('bonjour');
          expect(en.hello).toBe('hello');
          // PENDING the AppGrid 2.12 release (currently returns a 404)
          // no spanish locale - should return the default, french in this case
          // es.hello.should.equal('ola');
        });
    }
  );

  test('"getEntries" should return at least one entry', () => {
    const { offset, size } = paginationOptions;
    return client.getEntries({ offset, size })
      .then(({ entries }) => {
        expect(entries.length).toBeGreaterThan(0);
      });
  });

  test('"getEntries" with the id param should return multiple entries', () => {
    const params = Object.assign({}, paginationOptions, {
      id: ['56ea7bd6935f75032a2fd431', '56ea7c55935f75032a2fd437'],
      preview: false,
      at: new Date()
    });
    return client.getEntries(params)
      .then(({ entries }) => {
        expect(entries.length).toBe(params.id.length);
      });
  });

  test(
    '"getEntries" with the typeId param should return multiple entries',
    () => {
      const params = Object.assign({}, paginationOptions, {
        typeId: ['56ea7bca935f75032a2fd42c'],
        at: new Date()
      });
      return client.getEntries(params)
        .then(({ entries }) => {
          expect(entries.length).toBeGreaterThan(0);
        });
    }
  );

  test(
    '"getEntries" with the typeId param for multiple typeIds should perform a request too',
    () => {
      const paramsArray = Object.assign({}, paginationOptions, {
        typeId: ['56ea7bca935f75032a2fd42c', '56ea7bca935f75032a2fd42c'],
      });
      return client.getEntries(paramsArray)
        .then(({ entries }) => {
          expect(entries.length).toBeGreaterThan(0);
        });
    }
  );

  test(
    '"getEntries" with the alias param should return multiple entries, all with the given alias',
    () => {
      const aliases = ['greg', 'erik'];
      const params = Object.assign({}, paginationOptions, {
        alias: aliases
      });
      return client.getEntries(params)
        .then(({ entries }) => {
          expect(entries.length).toBeGreaterThan(0);
          expect(entries.some(e => !aliases.includes(e._meta.entryAlias))).toBe(false);
        });
    }
  );

  test(
    '"getEntries" with the typeAlias param should return multiple entries, all with the given typeAlias',
    () => {
      const typeAlias = 'exampleentrytype';
      const params = Object.assign({}, paginationOptions, {
        typeAlias,
      });
      return client.getEntries(params)
        .then(({ entries }) => {
          expect(entries.length).toBeGreaterThan(0);
          expect(entries.some(e => typeAlias !== e._meta.typeAlias)).toBe(false);
        });
    }
  );
});
