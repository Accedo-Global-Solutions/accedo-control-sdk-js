const makeAccedoOne = require('./clientWrapper');
const commonStamps = require('../commonStamps');
const appLogBrowser = require('../stamps/browser/appLog');

const stamp = commonStamps.compose(appLogBrowser);

/**
 * A wrapper over the Accedo One factory for browsers. If Web Storage is supported,
 * Provides default `onDeviceIdGenerated` and `onSessionKeyChanged` callbacks for
 * persistency through Web Storage. Also sets the `deviceId` and `sessionKey` values from
 * Web Storage to the factory when not given as an option.
 *
 * This behaviour can be customised by providing a `browserInfoProvider` function returning an
 * object with the keys `deviceId` and `sessionKey`. You could implement a different strategy
 * relying on cookies or a device-specific API for instance.
 *
 * If you do, you will want to customise the `onSessionKeyChanged` and `onDeviceIdGenerated`
 * callbacks as well.
 *
 * Refer to the factory's documentation to see other available options.
 *
 * Note this is this library's module export for Web Storage-enabled devices.
 *
 * @function
 * @param  {object} config the configuration for the new instance
 * @param  {string} config.browserInfoProvider A function that should return an object
 *                                             with `deviceId` and `sessionKey` properties, saved from
 *                                             previous sessions (see `onDeviceIdGenerated`, `onSessionKeyChanged`)
 * @param  {any} [config.appKey/log/gid/etc] You should also pass any extra option accepted by the accedoOne factory function (appKey, log, gid, ...)
 * @return {client}        an Accedo One client tied to the given params
 */
const accedoOneWrapperForBrowsers = makeAccedoOne(stamp);

module.exports = accedoOneWrapperForBrowsers;
