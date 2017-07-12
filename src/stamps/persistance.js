import stampit from 'stampit';

const memoryStorage = {};

const Stamp = stampit({
  props: {
    storageKeyDeviceId: 'ag_d',
    storageKeySessionKey: 'ag_s',
    hasLocalStorage: false,
    hasSessionStorage: false,
    hasSomeWebStorage: false,
  },
  methods: {
    getDeviceId() {
      if (this.isAllowedToUseBrowserStorage) { return localStorage[this.storageKeyDeviceId]; }
      return memoryStorage[this.storageKeyDeviceId];
    },
    setDeviceId(id) {
      let storage = memoryStorage;
      if (this.isAllowedToUseBrowserStorage) {
        storage = localStorage;
      }
      storage[this.storageKeyDeviceId] = id;
      return storage[this.storageKeyDeviceId];
    },
    getSessionKey() {
      if (this.isAllowedToUseBrowserStorage) { return sessionStorage[this.storageKeySessionKey]; }
      return memoryStorage[this.storageKeySessionKey];
    },
    setSessionKey(key) {
      let storage = memoryStorage;
      if (this.isAllowedToUseBrowserStorage) {
        storage = sessionStorage;
      }
      storage[this.storageKeySessionKey] = key;
      return storage[this.storageKeySessionKey];
    },
    getBrowserInfoProvider() {
      const deviceId = this.getDeviceId();
      const sessionKey = this.getSessionKey();
      return {
        deviceId,
        sessionKey,
      };
    },
  },
  init: function init({ storageKeyDeviceId, storageKeySessionKey }) {
    // Storage keys
    this.storageKeyDeviceId = storageKeyDeviceId || this.storageKeyDeviceId;
    this.storageKeySessionKey = storageKeySessionKey || this.storageKeySessionKey;

    // Flags for what storage is available
    this.hasLocalStorage = (typeof localStorage !== 'undefined');
    this.hasSessionStorage = (typeof sessionStorage !== 'undefined');
    this.hasSomeWebStorage = this.hasSessionStorage || this.hasLocalStorage;

    function checkIsAllowedToUseBrowserStorage(hasWebStorage) {
      if (!hasWebStorage) { return false; }
      try {
        const testKey = '___a___';
        const testValue = 'abc';
        localStorage[testKey] = testValue;
        sessionStorage[testKey] = testValue;
        return true;
      } catch (err) {
        return false;
      }
    }

    // Check that we're allowed to use the storage.
    // In private mode browser might have the feature but deny access to it
    this.isAllowedToUseBrowserStorage = checkIsAllowedToUseBrowserStorage(this.hasSomeWebStorage);
    return this;
  }
});

export default Stamp;
