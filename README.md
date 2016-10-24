# AppGrid SDK for Node.js [![npm](https://img.shields.io/npm/v/appgrid.svg?maxAge=3600)](https://www.npmjs.com/package/appgrid)

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
This is the official [Accedo AppGrid](https://www.accedo.tv/appgrid/) SDK for Node.js.
While AppGrid exposes a set of friendly REST APIs, this SDK is intended to provide a better integration with Node.js.
It also encourages the use of best practices (for example: reusing the same sessionId for a client, but different clients for different devices).

We follow [semantic versioning](http://semver.org/).
Check the [change log](./CHANGELOG.md) to find out what changed between versions.

## Features

These features are provided by the manual creation of AppGrid client instances (via the default exported factory) :
 - easy access to AppGrid APIs
 - automatic deviceId creation when none was provided
 - automatic session creation when none was provided (lazy - only when needed)
 - automatic session re-creation when the existing one has expired (lazy)
 - ensures only one session will be created at a time, even if a request triggers concurrent AppGrid calls

An express-compatible middleware is included and adds those extras on top :
 - automatic creation of AppGrid client instances for each request, attached to the response object for further use
 - automatically passes the requester's IP onto AppGrid calls for analytics and geolocated services
 - automatic reuse of the deviceId through cookies (can be customized to use anything else based on requests)
 - automatic reuse of the sessionKey through cookies (can be customized to use anything else based on requests)

Note when you use the middleware, you should also [configure Express to handle proxies correctly](http://expressjs.com/en/4x/api.html#trust.proxy.options.table) as we rely on the IP it gives us.

For instance: `app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])`

## Documentation

Refer to the [API docs for this SDK](https://accedo-products.github.io/appgrid-sdk-node/).

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
Below are a few examples, refer to `examples-es6.js` for more of them that you can run yourself (clone this repo then execute `npm run example`).

### Use the middleware to persist deviceId and sessionKey via cookies

```js
const appgrid = require('appgrid');
const express = require('express');

const PORT = 3000;

express()
// handle proxy servers if needed, to pass the user's IP instead of the proxy's.
.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])
// place the appgrid middleware before your request handlers
.use(appgrid.middleware.express({ appKey: '56ea6a370db1bf032c9df5cb' }))
.get('/test', (req, res) => {
   // access your client instance, it's already linked to the deviceId and sessionKey via cookies
   res.locals.appgridClient.getEntryById('56ea7bd6935f75032a2fd431')
   .then(entry => res.send(entry))
   .catch(err => res.status(500).send('Failed to get the result'));
})
.listen(PORT, () => console.log(`Server is on ! Try http://localhost:${PORT}/test`));
```

### Create an AppGrid client instance

_Note: this is not needed if you use the middleware. You can access a client instance at `res.locals.appgridClient`._

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

**DO NOT** reuse a single client, in your Node server, to relay requests from various consumers.

If you are triggering some AppGrid API calls in response to server requests, **you should create a new client every time**, by using the factory and reusing your application key and the consumer's deviceId (typically you would persist a consumer deviceId via the cookies, or as a request parameter in your server APIs - unless the device lets you use some unique ID like a MAC address).

Note again, the middleware (described above) does that work for you, so it's best to use it whenever possible.

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

### Download an asset from AppGrid
```javascript
import { createWriteStream } from 'fs';

// NOTE: You can get a list of all assets including their IDs by calling the 'getAllAssets' API
const idToDownload = 'someValidAssetId';
const fileName = `downloads/someFilename.png`;

client.getAssetById(idToDownload)
  .then((assetStream) => {
    return new Promise((resolve, reject) => {
      assetStream.pipe(createWriteStream(fileName))
        .on('close', resolve)
        .on('error', reject);
    });
  })
  .then(() => {
    console.log(`\t\t Successfully downloaded an asset by id from AppGrid.\n\t\t AssetId used: ${idToDownload}.\n\t\t Filename: ${fileName}`);
  })
  .catch((error) => {
    // TODO handle error
  });
```

## SDK development

  * Clone/fork this repo
  * Run `npm install`
  * Develop !
  * Before pushing, remember to:
    - generate updated UMD and ES6 bundles (`npm run build`)
    - add tests and check they all pass (`npm test`)
    - add examples and check they all work (`npm run example`)
    - document any public API with JSDoc comments and generate the new doc (`npm run doc`)

## More information & Links

* [AppGrid homepage](http://appgrid.accedo.tv/)
* [AppGrid knowledge base and API documentation](http://docs.appgrid.accedo.tv)

## Unit Tests

Mocha (with Chai) unit tests have been written to cover all of the exported APIs from this module. Follow the following steps in order to run them:

  * Follow the **Getting Started** steps above.
  * Run `npm test`

## License

See the [LICENSE file](./LICENSE.md) for license rights and limitations (Apache 2.0)
