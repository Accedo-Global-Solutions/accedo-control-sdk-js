import chai from 'chai';
import Persistance from '../../src/stamps/persistance';

chai.should();

const defaults = {
  keyDeviceId: 'ag_d',
  keySessionKey: 'ag_s'
};

describe('Persistance', () => {
  describe('constructor()', () => {
    it('Should allow creating an instance without arguments', () => {
      const persistance = Persistance();
      persistance.should.exist;
      persistance.should.have.property('storageKeyDeviceId', defaults.keyDeviceId);
      persistance.should.have.property('storageKeySessionKey', defaults.keySessionKey);
      persistance.should.have.property('hasLocalStorage', false);
      persistance.should.have.property('hasSessionStorage', false);
      persistance.should.have.property('hasSomeWebStorage', false);
    });
  });

  describe('getBrowserInfoProvider()', () => {
    it('Should return an object with `deviceId` and `sessionKey`', () => {
      const persistance = new Persistance();
      const browserInfo = persistance.getBrowserInfoProvider();
      browserInfo.should.exist;
      browserInfo.should.have.property('deviceId', undefined);
      browserInfo.should.have.property('sessionKey', undefined);

      const myDeviceId = 'loremipsum';
      const mySessionKey = 'dolarsitamet';
      persistance.setDeviceId(myDeviceId);
      persistance.setSessionKey(mySessionKey);
      const browserInfo2 = persistance.getBrowserInfoProvider();
      browserInfo2.deviceId.should.eql(myDeviceId);
      browserInfo2.sessionKey.should.eql(mySessionKey);
    });
  });
});
