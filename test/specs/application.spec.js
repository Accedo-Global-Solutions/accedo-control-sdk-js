import chai from 'chai';
import clientStamp from '../../src/client';

chai.should();

describe('Application API Tests', () => {
  const client = clientStamp({
    appKey: '56ea6a370db1bf032c9df5cb',
    uuid: 'gregTestingSDK'
  });

  it('getStatus should return the status of AppGrid', () => {
    return client.getApplicationStatus()
      .then(({ status }) => {
        status.should.be.ok;
      });
  });
});
