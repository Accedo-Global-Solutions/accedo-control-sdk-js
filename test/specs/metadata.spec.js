import chai from 'chai';
import clientStamp from '../../src/client';

chai.should();

describe('Metadata API Tests', () => {
  const client = clientStamp({
    appKey: '56ea6a370db1bf032c9df5cb',
    uuid: 'gregTestingSDK'
  });

  it('getAllMetadata should return at least one item from AppGrid', () => {
    return client.getAllMetadata()
      .then((metadata) => {
        Object.keys(metadata).length.should.be.greaterThan(0);
      });
  });

  it('getMetadataByKey should return a valid metadata item', () => {
    const key = 'android';
    return client.getMetadataByKey(key)
      .then((metadata) => {
        metadata.should.be.ok;
        metadata.should.have.property(key);
      });
  });

  it('getMetadataByKeys should return valid metadata items', () => {
    const keys = [
      'android',
      'colorScheme'
    ];
    return client.getMetadataByKeys(keys)
      .then((metadata) => {
        metadata.should.be.ok;
        keys.forEach((key) => metadata.should.have.property(key));
      });
  });
});
