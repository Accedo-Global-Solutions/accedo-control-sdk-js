const factory = require('../../src/node/index');

describe('Accedo One Client creation', () => {
  test('should throw when no param is passed', () => {
    const makeClient = () => factory();

    expect(makeClient).toThrow(Error);
  });

  test('should not throw when appKey and deviceId are passed', () => {
    const makeClient = () =>
      factory({
        appKey: '56ea6a370db1bf032c9df5cb',
        deviceId: 'gregTestingSDK',
      });

    expect(makeClient).not.toThrow(Error);
  });

  test('should throw when sessionKey is passed alone', () => {
    const makeClient = () =>
      factory({
        sessionKey: 'whatever',
      });

    expect(makeClient).toThrow(Error);
  });

  test('should not throw when sessionKey, appKey and deviceId are all passed', () => {
    const makeClient = () =>
      factory({
        sessionKey: 'whatever',
        appKey: '56ea6a370db1bf032c9df5cb',
        deviceId: 'gregTestingSDK',
      });

    expect(makeClient).not.toThrow(Error);
  });

  test('should throw when deviceId is passed without appKey and sessionKey', () => {
    const makeClient = () =>
      factory({
        deviceId: 'stuff_here',
      });

    expect(makeClient).toThrow(Error);
  });

  test('should not throw but generate a deviceId when appKey is passed without deviceId', () => {
    let client;
    const makeClient = () => {
      client = factory({
        appKey: '56ea6a370db1bf032c9df5cb',
      });
    };

    expect(makeClient).not.toThrow(Error);
    expect(typeof client.props.config.deviceId === 'string').toBeTruthy();
  });
});
