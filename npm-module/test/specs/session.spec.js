/* eslint-disable no-unused-expressions */

import chai from 'chai';
import AppGrid from '../../src/index';

import appGridOptions from '../appGridOptions';

chai.should();

const okStatus = 200;

describe('Session API Tests', () => {
  it('The API should exist and contain the expected functions', () => {
    AppGrid.session.should.be.an('object');
    AppGrid.session.getSession.should.be.a('function');
    AppGrid.session.getStatus.should.be.a('function');
    AppGrid.session.validateSession.should.be.a('function');
    AppGrid.session.generateUuid.should.be.a('function');
    AppGrid.session.updateSessionUuid.should.be.a('function');
  });

  it('"getSession" should return a new session from AppGrid', (done) => {
    AppGrid.session.getSession(appGridOptions)
      .then((newSessionId) => {
        newSessionId.should.be.ok;
        appGridOptions.sessionId = newSessionId;
        done();
      });
  });

  it('"getStatus" should return the status AppGrid', (done) => {
    AppGrid.session.getStatus(appGridOptions)
      .then(({ json: { status } }) => {
        status.should.be.ok;
        done();
      });
  });

  it('"validateSession" should return false for an invalid session', (done) => {
    const invalidSessionOptions = { ...appGridOptions, sessionId: 'BirdUp' };
    AppGrid.session.validateSession(invalidSessionOptions)
      .then((isValid) => {
        isValid.should.be.false;
        done();
      });
  });

  it('"validateSession" should return true for a valid session', (done) => {
    AppGrid.session.validateSession(appGridOptions)
      .then((isValid) => {
        isValid.should.be.true;
        done();
      });
  });

  it('"updateSessionUuid" should return successfully from AppGrid', (done) => {
    const newUuid = AppGrid.session.generateUuid();
    appGridOptions.uuid = newUuid;
    AppGrid.session.updateSessionUuid(appGridOptions)
      .then(({ status }) => {
        status.should.equal(okStatus);
        done();
      });
  });
});
