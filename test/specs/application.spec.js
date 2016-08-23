import chai from 'chai';
import factory from '../../src/index';

chai.should();

describe('Application API Tests', () => {
  const client = factory({
    appKey: '56ea6a370db1bf032c9df5cb',
    deviceId: 'gregTestingSDK'
  });

  it('getStatus should return the status of AppGrid', () => {
    return client.getApplicationStatus()
      .then(({ status }) => {
        status.should.be.ok;
      });
  });
});
