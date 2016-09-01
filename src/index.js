import uuidLib from 'uuid';
import stamp from './stamps/appgridClient';
import { getCurrentTimeOfDayDimValue } from './stamps/appLog';
import expressMwFactory from './express';

const noop = () => {};

/**
 * Check the parameters given are good enough to make api calls
 * @function
 * @param  {string} $0.appKey        the application key
 * @param  {string} [$0.deviceId]        a deviceId identifying the client we will make requests for
 * @param  {string} [$0.sessionKey]  a session key corresponding to this deviceId/appKey tuple
 * @return {boolean}                 true when all is well
 * @private
 */
const checkUsability = ({ appKey, deviceId, sessionKey } = {}) =>
  (appKey && !deviceId && !sessionKey) ||
  (appKey && deviceId && !sessionKey) ||
  (appKey && deviceId && sessionKey);

/**
 * Factory function to create an instance of an AppGrid client.
 *
 * You must get an instance before accessing any of the exposed client APIs.
 * @function
 * @param  {object} config the configuration for the new instance
 * @param  {string} config.appKey the application Key
 * @param  {string} [config.deviceId] the device identifier (if not provided, a uuid will be generated instead)
 * @param  {string} [config.sessionKey] the sessionKey (note a new one may be created when not given or expired)
 * @param  {string} [config.ip] the user's IP, given to AppGrid for every request this client will trigger (for geolocation).
 * @param  {function} [config.log] a function to use to see this SDK's logs
 * @param  {function} [config.onDeviceIdGenerated] callback to obtain the new deviceId, if one gets generated
 * @param  {function} [config.onSessionKeyChanged] callback to obtain the sessionKey, anytime a new one gets generated
 * @return {client}        an AppGrid client tied to the given params
 * @example
 * import appgrid from 'appgrid';
 *
 * // when all info is available - use all of it !
 * const client = appgrid({ appKey: 'MY_APP_KEY', deviceId: 'DEVICE_ID', sessionKey: 'SOME_SESSION_KEY' });
 *
 * // when there is no known sessionKey yet
 * const client2 = appgrid({ appKey: 'MY_APP_KEY', deviceId: 'DEVICE_ID' });
 *
 * // when there is no known sessionKey or deviceId yet
 * const client3 = appgrid({ appKey: 'MY_APP_KEY' });
 */
const appgrid = (config) => {
  const { gid, appKey, ip, log = noop, onDeviceIdGenerated = noop, onSessionKeyChanged = noop } = config;
  let { deviceId, sessionKey } = config;
  // First, check the params are OK
  if (!checkUsability(config)) {
    throw new Error('You must provide an appKey | an appKey and a deviceId | an appKey, a deviceId and a sessionKey');
  }
  // Generate a uuid if no deviceId was given
  if (!deviceId) {
    deviceId = appgrid.generateUuid();
    // trigger the callback
    onDeviceIdGenerated(deviceId);
  }

  const stampConfig = { deviceId, gid, ip, appKey, log, onSessionKeyChanged };
  Object.defineProperty(stampConfig, 'sessionKey', {
    set(val) { sessionKey = val; onSessionKeyChanged(val); },
    get() { return sessionKey; }
  });

  return stamp({
    props: { config: stampConfig }
  });
};

/**
 * Generate a UUID.
 *
 * Use this for a device/appKey tuple when you do not have a sessionKey already.
 *
 * This utility method is not used through an appgrid client instance, but available statically
 * @function
 * @return {string} a new UUID
 */
appgrid.generateUuid = () => uuidLib.v4();

/**
 * Returns the range of the current hour of the day, as a string such as '01-05' for 1am to 5 am.
 * Useful for AppGrid log events.
 *
 * This utility method is not used through an appgrid client instance, but available statically
 * @function
 * @return {string} a range of hours
 */
appgrid.getCurrentTimeOfDayDimValue = getCurrentTimeOfDayDimValue;

/**
 * An express-compatible middleware.
 *
 * This uses the cookie-parser middleware, so you can also take advantage of the `req.cookies` array.
 *
 * This middleware takes care of creating an AppGrid client instance for each request automatically.
 * By default, it will also reuse and persist the deviceId and sessionKey using the request and response cookies.
 * That strategy can be changed by passing the optional callbacks,
 * so you could make use of headers or request parameters for instance.
 *
 * Each instance is attached to the response object and available to the next express handlers as `res.locals.appgridClient`.
 *
 * This utility method is not used through an appgrid client instance, but available statically
 * @function
 * @param  {object} config the configuration
 * @param  {string} config.appKey the application Key that will be used for all appgrid clients
 * @param  {function} [config.getRequestInfo] callback that receives the request and returns an object with deviceId and sessionKey properties.
 * @param  {function} [config.onDeviceIdGenerated] callback that receives the new deviceId (if one was not returned by getRequestInfo) and the response
 * @param  {function} [config.onSessionKeyChanged] callback that receives the new sessionKey (anytime a new one gets generated) and the response
 * @param  {function} [config.log] Logging function that will be passed onto the client instance
 * @alias middleware.express
 * @return {function} a middleware function compatible with express
 * @example <caption>Using the default cookie strategy</caption>
 * const appgrid = require('appgrid');
 * const express = require('express');
 *
 * const PORT = 3000;
 *
 * express()
 * // place the appgrid middleware before your request handlers
 * .use(appgrid.middleware.express({ appKey: '56ea6a370db1bf032c9df5cb' }))
 * .get('/test', (req, res) => {
 *    // access your client instance, it's already linked to the deviceId and sessionKey via cookies
 *    res.locals.appgridClient.getEntryById('56ea7bd6935f75032a2fd431')
 *    .then(entry => res.send(entry))
 *    .catch(err => res.status(500).send('Failed to get the result'));
 * })
 * .listen(PORT, () => console.log(`Server is on ! Try http://localhost:${PORT}/test`));
 *
 * @example <caption>Using custom headers to extract deviceId and sessionKey and to pass down any change</caption>
 * const appgrid = require('appgrid_next');
 * const express = require('express');
 *
 * const PORT = 3000;
 * const HEADER_DEVICE_ID = 'X-AG-DEVICE-ID';
 * const HEADER_SESSION_KEY = 'X-AG-SESSION-KEY';
 *
 * express()
 * .use(appgrid.middleware.express({
 *   appKey: '56ea6a370db1bf032c9df5cb',
 *   // extract deviceId and sessionKey from custom headers
 *   getRequestInfo: req => ({ deviceId: req.get(HEADER_DEVICE_ID), sessionKey: req.get(HEADER_SESSION_KEY)}),
 *   // pass down any change on the deviceId (the header won't be set if unchanged compared to the value in getRequestInfo)
 *   onDeviceIdGenerated: (id, res) => res.set(HEADER_DEVICE_ID, id),
 *   // pass down any change on the sessionKey (the header won't be set if unchanged compared to the value in getRequestInfo)
 *   onSessionKeyChanged: (key, res) => res.set(HEADER_SESSION_KEY, key),
 *   log(...args) { console.log(...args) }
 * }))
 * .get('/test', (req, res) => {
 *   res.locals.appgridClient.getEntryById('56ea7bd6935f75032a2fd431')
 *   .then(entry => res.send(entry))
 *   .catch(err => res.status(500).send('Failed to get the result'));
 * })
 * .listen(PORT, () => console.log(`Server is on ! Try http://localhost:${PORT}/test`));
 */
appgrid.middleware = {
  express: expressMwFactory(appgrid)
};

export default appgrid;
