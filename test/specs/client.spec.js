import chai from 'chai';
import factory from '../../src/index';

const should = chai.should();

describe('Appgrid Client creation', () => {
  it('should throw when no param is passed', () => {
    const makeClient = () => factory();

    makeClient.should.throw(Error);
  });

  it('should not throw when appKey and deviceId are passed', () => {
    const makeClient = () => factory({
      appKey: '56ea6a370db1bf032c9df5cb',
      deviceId: 'gregTestingSDK'
    });

    makeClient.should.not.throw(Error);
  });

  it('should throw when sessionKey is passed alone', () => {
    const makeClient = () => factory({
      sessionKey: 'whatever'
    });

    makeClient.should.throw(Error);
  });

  it('should not throw when sessionKey, appKey and deviceId are all passed', () => {
    const makeClient = () => factory({
      sessionKey: 'whatever',
      appKey: '56ea6a370db1bf032c9df5cb',
      deviceId: 'gregTestingSDK'
    });

    makeClient.should.not.throw(Error);
  });

  it('should throw when deviceId is passed without appKey and sessionKey', () => {
    const makeClient = () => factory({
      deviceId: 'stuff_here',
    });

    makeClient.should.throw(Error);
  });

  it('should not throw but generate a deviceId when appKey is passed without deviceId', () => {
    let client;
    const makeClient = () => {
      client = factory({
        appKey: '56ea6a370db1bf032c9df5cb',
      });
    };

    makeClient.should.not.throw(Error);
    should.equal(true, client.props.config.deviceId && typeof client.props.config.deviceId === 'string');
  });
});
