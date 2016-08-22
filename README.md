# AppGrid SDK for Node.js

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
This is the official Accedo AppGrid SDK for Node.js . While AppGrid exposes a set of friendly REST APIs, this SDK is intended to provide a better integration with Node.js; it also encourages the use of Best Practices (for example: reusing the same SessionId for a client, but different clients for different devices).

Check the CHANGELOG.md file to find out what changed between versions.

## Getting started

  * Clone this repo locally
  * Run `npm install`
  * To run the examples, execute the following command: `npm run runExample`. **NOTE**: This will clean and rebuild the dist folder

## How to use / examples
Refer to the `examples-es6.js` file for comprehensive examples that cover all of the APIs exported by this module.

#### Creating an AppGrid client instance
An instance of an AppGrid client must be obtained. It's created with the factory exported as the default export in this library, with parameters for the specific client you need.

```javascript
import appgridClientFactory from 'appgrid';

const client = agClientFactory({
  appKey: 'YOUR_APPGRID_APPLICATION_KEY',
  uuid: 'A_DEVICE_UUID',
  // if there is already a session for this appKey/uuid tuple, provide it
  sessionKey: 'AN_EXISTING_SESSION_KEY',
  // gid can be passed as well, it will be used for all API calls
  gid: 'SOME_GROUP_ID',
  // turn on the SDK debug logs by adding a log function such as this one
  // log(...args) { console.log(...args); },
});
```

You should create a new client for every device that needs to access the AppGrid APIs.

**DO NOT** reuse a single client, in your Node server, to relay requests from various consumers.

If you are triggering some AppGrid API calls in response to server requests, **you should create a new client every time**, by using the factory and reusing your application key and the consumer's uuid (typically you would persist a consumer uuid via the cookies, or as a request parameter in your server APIs).

#### Get a new AppGrid SessionId

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

#### Get all AppGrid Metadata associated with your AppId
```javascript
client.getAllMetadata()
  .then((metadata) => {
    console.log('\t\t Successfully requested all metadata from AppGrid', metadata);
  })
  .catch((error) => {
    // TODO handle error
  });
```

#### Download an asset from AppGrid
```javascript
import { createWriteStream } from 'fs';

// NOTE: You can get a list of all assets including their IDs by calling the 'getAllAssets' API
const idToDownload = 'someValidAssetId';
const fileName = `downloads/someFilename.png`;

client.getAssetStreamById(idToDownload)
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

## More information & Links

* [AppGrid Homepage](http://appgrid.accedo.tv/)
* [AppGrid User Guide and API Documentation](https://appgrid.cloud.accedo.tv/help)

## Unit Tests
  Mocha (with Chai) unit tests have been written to cover all of the exported APIs from this module. Follow the following steps in order to run them:

  * Follow the **Getting Started** steps above.
  * Run `npm test`
