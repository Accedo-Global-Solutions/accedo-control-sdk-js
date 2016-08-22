import chai from 'chai';
import factory from '../../src/index';

chai.should();

const okStatus = 200;

describe('Events API Tests', () => {
  const client = factory({
    appKey: '56ea6a370db1bf032c9df5cb',
    uuid: 'gregTestingSDK',
  });

  it('sendUsageStartEvent should successfully send a usage start event to AppGrid', () => {
    return client.sendUsageStartEvent()
      .then(({ status }) => {
        status.should.equal(okStatus);
      });
  });

  it('sendUsageStopEvent should successfully send a usage stop event to AppGrid after 3 seconds', () => {
    const rententionTimeInSeconds = 3;

    return new Promise(resolve => {
      setTimeout(() => resolve(), rententionTimeInSeconds * 1000);
    })
    .then(() => {
      return client.sendUsageStopEvent(rententionTimeInSeconds)
      .then(({ status }) => {
        status.should.equal(okStatus);
      });
    });
  });
});
