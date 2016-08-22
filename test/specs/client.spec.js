import chai from 'chai';
import clientStamp from '../../src/client';

chai.should();

describe('Appgrid Client creation', () => {
  it('should throw when no param is passed', () => {
    const makeClient = () => clientStamp();

    makeClient.should.throw(Error);
  });

  it('should throw when no param is passed', () => {
    const makeClient = () => clientStamp();

    makeClient.should.throw(Error);
  });

  it('should not throw when appKey and uuid are passed', () => {
    const makeClient = () => clientStamp({
      appKey: '56ea6a370db1bf032c9df5cb',
      uuid: 'gregTestingSDK'
    });

    makeClient.should.not.throw(Error);
  });

  it('should not throw when sessionKey is passed', () => {
    const makeClient = () => clientStamp({
      sessionKey: 'whatever'
    });

    makeClient.should.not.throw(Error);
  });

  it('should not throw when sessionKey, appKey and uuid are all passed', () => {
    const makeClient = () => clientStamp({
      sessionKey: 'whatever',
      appKey: '56ea6a370db1bf032c9df5cb',
      uuid: 'gregTestingSDK'
    });

    makeClient.should.not.throw(Error);
  });

  it('should throw when appKey is passed without uuid and sessionKey', () => {
    const makeClient = () => clientStamp({
      appKey: '56ea6a370db1bf032c9df5cb',
    });

    makeClient.should.throw(Error);
  });

  it('should throw when uuid is passed without appKey and sessionKey', () => {
    const makeClient = () => clientStamp({
      uuid: 'stuff_here',
    });

    makeClient.should.throw(Error);
  });
});
