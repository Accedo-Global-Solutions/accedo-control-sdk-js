# AppGrid SDK for Node.js and browsers [![npm](https://img.shields.io/npm/v/appgrid.svg?maxAge=3600)](https://www.npmjs.com/package/appgrid)

```
*******************************************************************************

       $$$$$$\                       $$$$$$\            $$\       $$\
      $$  __$$\                     $$  __$$\           \__|      $$ |
      $$ /  $$ | $$$$$$\   $$$$$$\  $$ /  \__| $$$$$$\  $$\  $$$$$$$ |
      $$$$$$$$ |$$  __$$\ $$  __$$\ $$ |$$$$\ $$  __$$\ $$ |$$  __$$ |
      $$  __$$ |$$ /  $$ |$$ /  $$ |$$ |\_$$ |$$ |  \__|$$ |$$ /  $$ |
      $$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |      $$ |$$ |  $$ |
      $$ |  $$ |$$$$$$$  |$$$$$$$  |\$$$$$$  |$$ |      $$ |\$$$$$$$ |
      \__|  \__|$$  ____/ $$  ____/  \______/ \__|      \__| \_______|
                $$ |      $$ |
                $$ |      $$ |
                \__|      \__|

*******************************************************************************
```

## Summary

This is the official [Accedo AppGrid](https://www.accedo.tv/appgrid/) SDK for Node.js and browsers.
While AppGrid exposes a set of friendly REST APIs, this SDK is intended to provide a smoother experience when coding in JS.
It also encourages the use of best practices (for example: reusing the same sessionId for a client, but different clients for different devices).

We follow [semantic versioning](http://semver.org/).
Check the [change log](./CHANGELOG.md) to find out what changed between versions.

## Supported browsers

This project is written in ES2015 and the browsers build is transpiled to ES5.
All modern browsers are supported (Firefox, Chrome, Opera, Safari, Edge, their mobile versions and declinations).

⚠️ If you need to support IE 11 (or other legacy browsers), make sure to load polyfills for the ES2015 features before loading this library. You can either use one such as what babel offers, or just the strict necessary: an ES6 Promise polyfill and another one for `Object.assign`.
Refer to `example-browser.html` for an example on using such a polyfill.

## Supported Node.js versions

This should work from version 4, but we test on, and recommend to use Node LTS version 6 or above.

## Features

These features are provided by the manual creation of AppGrid client instances (via the default exported factory) :
 - easy access to AppGrid APIs
 - automatic deviceId creation when none was provided
 - automatic session creation when none was provided (lazy - only when needed)
 - automatic session re-creation when the existing one has expired (lazy)
 - ensures only one session will be created at a time, even if a request triggers concurrent AppGrid calls

:information_source: _For Node, an [express-compatible middleware is also available as a separate package](https://github.com/Accedo-Products/appgrid-sdk-express).
You should really consider using it if possible, as it makes things even easier and provides extra features._

## Documentation

Refer to the [API docs for this SDK](https://accedo-products.github.io/appgrid-sdk-js/).

You may also want to refer to the [AppGrid Rest API documentation](http://docs.appgrid.apiary.io/) that this SDK uses behind the scenes. AppGrid-specific terminology is defined there.

## Installation

`npm install --save appgrid` (or, for yarn users: `yarn add appgrid`)

Then you can use the default export to get a factory:
```js
const appgrid = require('appgrid')
```
Or, using the ES6 module syntax:
```js
import appgrid from 'appgrid'
```

## Examples
Below are a few examples, refer to `example-node.js` for more of them that you can run yourself (clone this repo then execute `node example-node.js`).

### Create an AppGrid client instance

:point_right: _On Node, we recommend you use the [Express middleware](https://github.com/Accedo-Products/appgrid-sdk-express) instead, as it makes it easier and enforces some more best practices._

An instance of an AppGrid client must be obtained. It's created with the factory exported as the default export in this library, with parameters for the specific client you need.

```javascript
// this is an AppGrid client factory - name it "factory", "appgrid" (as above), or anything else
import factory from 'appgrid';

const client = factory({
  appKey: 'YOUR_APPGRID_APPLICATION_KEY',
  deviceId: 'A_DEVICE_ID',
  // if there is already a session for this appKey/deviceId tuple, provide it
  sessionKey: 'AN_EXISTING_SESSION_KEY',
  // gid can be passed as well, it will be used for all API calls
  gid: 'SOME_GROUP_ID',
  // turn on the SDK debug logs by adding a log function such as this one
  // log(...args) { console.log(...args); },
});
```

You should create a new client for every device that needs to access the AppGrid APIs.

:warning: **DO NOT** reuse a single client, in your Node server, to relay requests from various consumers.

If you are triggering some AppGrid API calls in response to server requests, **you should create a new client every time**, by using the factory and reusing your application key and the consumer's deviceId (typically you would persist a consumer deviceId via the cookies, or as a request parameter in your server APIs - unless the device lets you use some unique ID like a MAC address).

:bulb: Note again, the middleware (see above) does that work for you, so it's best to use it whenever possible.

### Get a new AppGrid SessionId

This lets you manually create a new session, that will be stored for reuse onto this client instance.
Note that any API call that needs a session will trigger this method implicitly if no session is attached to the client yet.

```javascript
client.createSession()
  .then((newSessionId) => {
    console.log(`\t\t Successfully requested a new Session from AppGrid.\n\t\t   SessionId: ${newSessionId}`);
  })
  .catch((error) => {
    // TODO handle error
  });

```

### Get all AppGrid Metadata associated with your AppId
```javascript
client.getAllMetadata()
  .then((metadata) => {
    console.log('\t\t Successfully requested all metadata from AppGrid', metadata);
  })
  .catch((error) => {
    // TODO handle error
  });
```

## SDK development

  * Clone/fork this repo
  * Run `yarn` (you should have yarn installed globally)
  * Develop !
  * Before pushing, remember to:
    - generate updated UMD and ES6 bundles (`yarn run build`)
    - add tests and check they all pass (`yarn test`)
    - add examples and check they all work (`node example-node.js`)
    - document any public API with JSDoc comments and generate the new doc (`yarn run doc`)

### Testing code in the browser

Make sure to build as mentioned above, then open the `example-browser.html` file in your browser.

On an OSX shell, you can use `open example-browser.html`.
To serve it on a local web server, you can use `php -S localhost:9000` or `python -m SimpleHTTPServer 9000` if you have php or python binaries available on your path.
Other options include Apache, Nginx, and Node-based servers such as [`http-server`](https://www.npmjs.com/package/http-server) or [`static-server`](https://www.npmjs.com/package/static-server).

The sample includes the polyfills necessary for older browsers (those that do not support ES6).

## More information & Links

* [AppGrid homepage](http://appgrid.accedo.tv/)
* [AppGrid knowledge base and API documentation](http://docs.appgrid.accedo.tv)
* [The Express-compatible middleware](https://github.com/Accedo-Products/appgrid-sdk-express) that relies on this library.

## Unit Tests

Jest unit tests have been written to cover all of the exported APIs from this module. Tests will we called by running `npm test` or `yarn test`.

## License

See the [LICENSE file](./LICENSE.md) for license rights and limitations (Apache 2.0)
