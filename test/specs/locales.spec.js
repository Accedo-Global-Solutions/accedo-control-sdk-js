import chai from 'chai';
import factory from '../../src/index';

chai.should();

describe('Locales API Tests', () => {
  const client = factory({
    appKey: '56ea6a370db1bf032c9df5cb',
    deviceId: 'gregTestingSDK'
  });

  it('getAvailableLocales should at return an array of locales', () => {
    return client.getAvailableLocales()
      .then((res) => {
        res.should.be.an('object');
        res.should.have.property('locales');
        res.locales.should.be.an('array');
        res.locales[0].should.have.property('code');
        res.locales[0].should.have.property('displayName');
      });
  });
});
