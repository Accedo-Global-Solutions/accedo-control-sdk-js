/* eslint-disable no-unused-expressions */

import chai from 'chai';
import AppGrid from '../../dist/index.js';

import appGridOptions from '../appGridOptions';

chai.should();

const okStatus = 200;

describe('Events API Tests', () => {
  it('The API should exist and contain the expected functions', () => {
    AppGrid.events.should.be.an('object');
    AppGrid.events.sendUsageStartEvent.should.be.a('function');
    AppGrid.events.sendUsageStopEvent.should.be.a('function');
  });

  it('"sendUsageStartEvent" should successfully send a usage start event to AppGrid', (done) => {
    AppGrid.events.sendUsageStartEvent(appGridOptions)
      .then(({ status }) => {
        status.should.equal(okStatus);
        done();
      });
  });

  it('"sendUsageStopEvent" should successfully send a usage stop event to AppGrid after 3 seconds', (done) => {
    const rententionTimeInSeconds = 3;
    setTimeout(() => {
      AppGrid.events.sendUsageStopEvent(rententionTimeInSeconds, appGridOptions)
        .then(({ status }) => {
          status.should.equal(okStatus);
          done();
        });
    }, rententionTimeInSeconds * 1000);
  });
});
