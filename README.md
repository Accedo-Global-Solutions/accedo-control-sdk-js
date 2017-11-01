# Accedo One SDK for Node.js and browsers [![npm](https://img.shields.io/npm/v/@accedo/accedo-one.svg?maxAge=3600)](https://www.npmjs.com/package/@accedo/accedo-one)

```
   _                    _           ___
  /_\   ___ ___ ___  __| | ___     /___\_ __   ___
 //_\\ / __/ __/ _ \/ _` |/ _ \   //  // '_ \ / _ \
/  _  \ (_| (_|  __/ (_| | (_) | / \_//| | | |  __/
\_/ \_/\___\___\___|\__,_|\___/  \___/ |_| |_|\___|

```

## Summary

This is the official [Accedo One](https://www.accedo.tv/one) SDK for Node.js and browsers, previously known as the AppGrid JS SDK.
While Accedo One exposes a set of friendly REST APIs, this SDK is intended to provide a smoother experience when coding in JS.
It also encourages the use of best practices (for example: reusing the same sessionId for a client, but different clients for different devices).

We follow [semantic versioning](http://semver.org/).
Check the [change log](./CHANGELOG.md) for a listing of changes and new features per version.

## Supported browsers

This project is written in ES2015 and the browsers build is transpiled to ES5.
All modern browsers are supported (Firefox, Chrome, Opera, Safari, Edge, their mobile versions and declinations).

⚠️ If you need to support IE 11 (or other legacy browsers), make sure to load polyfills for the ES2015 features before loading this library. You can either use one such as what babel offers, or just the strict necessary: an ES6 Promise polyfill and another one for `Object.assign`.
Refer to `example-browser.html` for an example on using such a polyfill.

We use CommonJS modules rather than ES6 modules, so no compilation step is needed on Node.

## Supported Node.js versions

This should work from version 4, but we test on, and recommend to use the latest LTS version of Node (currently Node 6, soon Node 8).

## Features

The default factory exposed by this SDK allows creating a client instance tied to a device id and an application key. It provides these features :
 - easy access to Accedo One APIs
 - automatic deviceId creation when none was provided
 - automatic session creation when none was provided (lazy - only when needed)
 - automatic session re-creation when the previous one has expired (lazy)
 - ensures only one session will be created at a time, even if concurrent Accedo One requests are made
 - specific to Detect:
  - ensures concurrent calls to get the log level will result in one network call at most
  - caches the log level for 3 minutes
  - on browsers, individual logs are only sent when necessary (i.e. when the log's level is equal or higher than the current level set on the app), and automatically grouped then sent as a batch (see the `sendLog` doc)

:information_source: _For Node, an [express-compatible middleware is also available as a separate package](https://github.com/Accedo-Products/accedo-one-sdk-express).
You should really consider using it if possible, as it makes things even easier and provides extra features._

## Documentation

Refer to the [API docs for this SDK](https://accedo-products.github.io/accedo-one-sdk-js/).

You may also want to refer to the [Accedo One Rest API documentation](https://developer.one.accedo.tv/) that this SDK uses behind the scenes. Accedo One-specific terminology is defined there.

## Installation

`npm install --save @accedo/accedo-one` (or, for yarn users: `yarn add @accedo/accedo-one`)

Then you can use the default export to get a factory:
```js
const accedoOne = require('@accedo/accedo-one')
```
Or, using the ES6 module syntax:
```js
import accedoOne from '@accedo/accedo-one'
```

## Examples
Below are a few examples, refer to `example-node.js` for more of them that you can run yourself (clone this repo then execute `node example-node.js`).

### Create an Accedo One client instance

:point_right: _On Node, we recommend you use the [Express middleware](https://github.com/Accedo-Products/accedo-one-sdk-express) instead, as it makes it easier and enforces some more best practices._

An instance of an Accedo One client must be obtained. It's created with the factory exported as the default export in this library, with parameters for the specific client you need.

```javascript
// This is an Accedo One client factory - name it "factory", "accedoOne", or anything else.
// If you use this library on a browser through a <script> tag, `accedoOne` is a global variable
// so you do not need to import or require anything.
import accedoOne from '@accedo/accedo-one';

const client = accedoOne({
  appKey: 'YOUR_ACCEDO_ONE_APPLICATION_KEY',
  deviceId: 'A_DEVICE_ID',
  // if there is already a session for this appKey/deviceId tuple, provide it
  sessionKey: 'AN_EXISTING_SESSION_KEY',
  // gid can be passed as well, it will be used for all API calls
  gid: 'SOME_GROUP_ID',
  // turn on the SDK debug logs by adding a log function such as this one
  // log(...args) { console.log(...args); },
});
```

You should create a new client for every device that needs to access the Accedo One APIs.

:warning: **DO NOT** reuse a single client, in your Node server, to relay requests from various consumers.

If you are triggering some Accedo One API calls in response to server requests, **you should create a new client every time**, by using the factory and reusing your application key and the consumer's deviceId (typically you would persist a consumer deviceId via the cookies, or as a request parameter in your server APIs - unless the device lets you use some unique ID like a MAC address).

:bulb: Note again, the middleware (see above) does that work for you, so it's best to use it whenever possible.

### Create a new Accedo One session

The `client.createSession` lets you manually create a new session, that will be stored for reuse onto this client instance.
As any API call that needs a session will trigger this method implicitly when needed, **you will normally not need to ever do this yourself**.

### Get all Accedo One Metadata associated with your application key
```javascript
client.getAllMetadata()
  .then(metadata => {
    console.log('Successfully requested all metadata from Accedo One', metadata);
  })
  .catch(error => {
    // TODO handle error
  });
```

## SDK development

  * Clone/fork this repo
  * Run `yarn` (you should have yarn installed globally)
  * Code !
  * Before pushing, remember to:
    - update the UMD bundle (`yarn run build`)
    - add tests and check they all pass (`yarn test`)
    - add examples and check they all work (`node example-node.js`)
    - document any public API with JSDoc comments and generate the new doc (`yarn run doc`)

### Testing code in the browser

If necessary, update the UMD bundle as noted above, then open the `example-browser.html` file in your browser.

On an OSX shell, you can use `open example-browser.html`.
To serve it on a local web server, you can use `php -S localhost:9000` or `python -m SimpleHTTPServer 9000` if you have php or python binaries available on your path.
Other options include Apache, Nginx, and Node-based servers such as [`http-server`](https://www.npmjs.com/package/http-server) or [`static-server`](https://www.npmjs.com/package/static-server).

The sample includes the polyfills necessary for older browsers like IE11 (those that do not support ES6).

## More information & Links

* [Accedo One homepage](https://www.accedo.tv/one)
* [Accedo One help center](https://support.one.accedo.tv)
* [Accedo One API documentation](https://developer.one.accedo.tv)
* [The Express-compatible middleware](https://github.com/Accedo-Products/accedo-one-sdk-express) that relies on this library.

## Unit Tests

Jest unit tests have been written to cover all of the exported APIs from this module. Tests will we called by running `npm test` or `yarn test`.

## License

See the [LICENSE file](./LICENSE.md) for license rights and limitations (Apache 2.0)
