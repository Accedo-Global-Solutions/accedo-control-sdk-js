import chai from 'chai';
import sinon from 'sinon';
import factory from '../../src/index';

const should = chai.should();

describe('Session API Tests', () => {
  const onSessionKeyChanged = sinon.spy();
  const client = factory({
    appKey: '56ea6a370db1bf032c9df5cb',
    deviceId: 'gregTestingSDK',
    onSessionKeyChanged
  });

  it('getSessionKey should return a falsy value at first', () => {
    const key = client.getSessionKey();
    should.not.equal(true, !!key);
  });

  it('should not have called onSessionKeyChanged yet', () => {
    onSessionKeyChanged.called.should.be.false;
  });

  it('createSession should return a session key', () => {
    return client.createSession()
      .then((response) => {
        response.should.be.a('string');
      });
  });

  it('should have called onSessionKeyChanged by now', () => {
    onSessionKeyChanged.called.should.be.true;
  });

  it('getSessionKey should return a string value after a session was attached to the client', () => {
    const key = client.getSessionKey();
    key.should.be.a('string');
  });

  describe('With concurrent calls by one same client...', () => {
    const onSessionKeyChangedB = sinon.spy();
    const clientB = factory({
      appKey: '56ea6a370db1bf032c9df5cb',
      deviceId: 'gregTestingSDK',
      onSessionKeyChanged: onSessionKeyChangedB
    });

    it('should only create one session and propagate it to all clients', () => {
      return Promise.all([clientB.createSession(), clientB.createSession(), clientB.createSession()])
      .then(([key1, key2, key3]) => {
        key1.should.equal(key2);
        key1.should.equal(key3);
        onSessionKeyChangedB.calledOnce.should.be.true;
      });
    });
  });
});
