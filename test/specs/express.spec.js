import chai from 'chai';
import sinon from 'sinon';
import appgrid from '../../src/index';

const should = chai.should();

const NOOP = () => {};
const SOME_IP = '1.3.3.7';
const COOKIE_DEVICE_ID = 'ag_d';
const COOKIE_SESSION_KEY = 'ag_s';

const buildRequest = (cookies = {}) => ({
  cookies,
  ip: SOME_IP
});

const buildResponse = () => ({
  locals: {},
  cookie: sinon.spy()
});

describe.only('The Express middleware', () => {
  const mw = appgrid.middleware.express({
    appKey: '56ea6a370db1bf032c9df5cb'
  });

  it('exposes a function', () => {
    mw.should.be.a('function');
  });

  it('should call the next handler in the Express pipeline', () => {
    const next = sinon.spy();
    mw(buildRequest(), buildResponse(), next);
    next.calledOnce.should.be.true;
  });

  it('should attach a configured locals.appgridClient response prop as per the parameters and cookies', () => {
    const response = buildResponse();
    const cookies = {
      [COOKIE_DEVICE_ID]: 'gregTestingSDK',
      [COOKIE_SESSION_KEY]: 'gregSessionKey'
    };
    mw(buildRequest(cookies), response, NOOP);
    const { appgridClient } = response.locals;
    appgridClient.should.be.an('object');
    appgridClient.props.config.appKey.should.equal('56ea6a370db1bf032c9df5cb');
    appgridClient.props.config.deviceId.should.equal(cookies[COOKIE_DEVICE_ID]);
    appgridClient.props.config.sessionKey.should.equal(cookies[COOKIE_SESSION_KEY]);
  });

  describe('when no deviceId or sessionKey is found in the request cookies', () => {
    const mw = appgrid.middleware.express({ // eslint-disable-line no-shadow
      appKey: '56ea6a370db1bf032c9df5cb'
    });
    const response = buildResponse();
    mw(buildRequest(), response, NOOP);
    const { appgridClient } = response.locals;

    it('generates the deviceId on invocation and sets the deviceId response cookie', () => {
      const { deviceId } = appgridClient.props.config;
      deviceId.should.be.a('string');
      response.cookie.calledWith(COOKIE_DEVICE_ID, deviceId).should.be.true;
    });

    it('does not create a session if not needed', () => {
      const { sessionKey } = appgridClient.props.config;
      should.equal(false, !!sessionKey);
      response.cookie.calledWith(COOKIE_SESSION_KEY).should.be.false;
    });

    it('when a sessionKey is (re)created, sets the sessionKey response cookie', () => {
      return appgridClient.getApplicationStatus().then(() => {
        const { sessionKey } = appgridClient.props.config;
        sessionKey.should.be.a('string');
        response.cookie.calledWith(COOKIE_SESSION_KEY, sessionKey).should.be.true;
      });
    });
  });
});
