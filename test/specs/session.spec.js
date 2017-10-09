const factory = require('../../src/node/index');

describe('Session API Tests', () => {
  const onSessionKeyChanged = jest.fn();
  const client = factory({
    appKey: '56ea6a370db1bf032c9df5cb',
    deviceId: 'gregTestingSDK',
    onSessionKeyChanged,
  });

  test('getSessionKey should return a falsy value at first', () => {
    const key = client.getSessionKey();
    expect(key).toBeFalsy();
  });

  test('should not have called onSessionKeyChanged yet', () => {
    expect(onSessionKeyChanged).not.toBeCalled();
  });

  test('createSession should return a session key', () => {
    return client.createSession().then(response => {
      expect(typeof response).toBe('string');
    });
  });

  test('should have called onSessionKeyChanged by now', () => {
    expect(onSessionKeyChanged).toBeCalled();
  });

  test('getSessionKey should return a string value after a session was attached to the client', () => {
    const key = client.getSessionKey();
    expect(typeof key).toBe('string');
  });

  describe('With concurrent calls by one same client...', () => {
    const onSessionKeyChangedB = jest.fn();
    const clientB = factory({
      appKey: '56ea6a370db1bf032c9df5cb',
      deviceId: 'gregTestingSDK',
      onSessionKeyChanged: onSessionKeyChangedB,
    });

    test('should only create one session and propagate it to all clients', () => {
      return Promise.all([
        clientB.createSession(),
        clientB.createSession(),
        clientB.createSession(),
      ]).then(([key1, key2, key3]) => {
        expect(key1).toBe(key2);
        expect(key1).toBe(key3);
        expect(onSessionKeyChangedB.mock.calls.length).toBe(1);
      });
    });
  });
});
