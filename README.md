# AppGrid SDK for Node.js

```
*******************************************************************************

    MMMMMMMMMMMMMMMMMMMMMMNNNhhyysyyyyyyyyyyyshhdNNNMMMMMMMMMMMMMMMMMMMMMM
    MMMMMMMMMMMMMMMMMMNdhyysoooooooooooooooooooooosyyddNMMMMMMMMMMMMMMMMMM
    MMMMMMMMMMMMMMMmmhysoooooooooooooooooooooooooooooosyhNNMMMMMMMMMMMMMMM
    MMMMMMMMMMMMNmysoooooooooooooooooooooooooooooooooooooosymNMMMMMMMMMMMM
    MMMMMMMMMMNhyooooooooooooooooooooooooooooooooooooooooooooyhNMMMMMMMMMM
    MMMMMMMMNhsooooooooooooooooooooooooooooooooooooooooooooooooyhNMMMMMMMM
    MMMMMMNhsooooooooooooooooooooooooooooooooooooooooooooooooooo+shNMMMMMM
    MMMMMmyooooooooooooooooooooooooooooooooooooooooooooooooooooooooydMMMMM
    MMMMsyoooooooooooooooooo+++oooooooooooooooo+++ooooooooooooooooooyyMMMM
    MMMdyooooooooooooooo/-`     `-/oooooooo/-`     `-/oooooooooooooooyhMMM
    MMhhoooooooooooooo+.           .+oooo+.           .+ooooooooooooooydMM
    Mdhoooooooooooooo+`             `+oo+`             `+oooooooooooooohdM
    Ndooooooooooooooo:               :oo:               /oooooooooooooooym
    dyooooooooooooooo/               /oo:               /ooooooooooooooosm
    hooooooooooooooooo.             .ooo/`             .oooooooooooooooood
    doooooooooooooooooo:`         `:oo+.             `:ooooooooooooooooood
    d+oooooooooooooooooo+/-.```.-/+o/.    `-/-.```.-/+oooooooooooooooooo+d
    d+oooooooooooooooooooooooooooo/.    `:+oooooooooooooooooooooooossooo+d
    d+oooooooooooooooooo+/-.```.-.    `:+oo+/-.```.-/+oooooooosssyyyyyoo+d
    doooooooooooooooooo:`           `-+oo+:`         `:ooossyyys+:..sysood
    hooooooooooooooooo.             .ooo+.         `.:+syyso/-`     -sysoy
    myooooooooooooooo/               /oo:      .-/osyso/-`     .+o-  :syyd
    myooooooooooooooo:               :oo: `-/osyyyyo.`    -/+` `oys.  /yyh
    Mdhoooooooooooooo+`             `oosssyys+/-`/yy:     .syo` .sys`  /yy
    MMdyoooooooooooooo+.        `.:+syyso/-`      +ys-     -yy+  .syo`.:sy
    MMMhyooooooooooooooo/-. `-/osyysyy+`     /o+  `oys.     :yy/ `+yysyyyy
    MMMMyyooooooooooooooossyyys+/-``+yy-     :sy/  `syo`    `oyysyyyshhdmN
    MMMMMdyooooooooooosyyso/-`   `  `oys.     /so.  .syo.:+syyyssssydNNMMM
    MMMMMMNysooooooooosyy-     `os+  .sys.     `   `-oyyyyyssooo+smNMMMMMM
    MMMMMMMMNhyoooooooosys.     :yy/  .syo`     :+syyyssoooooooshdMMMMMMMM
    MMMMMMMMMMNhyooooooosys`     /ys:  -sy+`    .syysooooooooshNMMMMMMMMMM
    MMMMMMMMMMMMNmyooooooyyo      +ys:-+syy/`-/+syyysoooooyhmNMMMMMMMMMMMM
    MMMMMMMMMMMMMMMNNyssooyy/   `-+yyyyyssyyyyyssooooossydNMMMMMMMMMMMMMMM
    MMMMMMMMMMMMMMMMMMNmdyyyy++syyysssoooosssooooosyydmNMMMMMMMMMMMMMMMMMM
    MMMMMMMMMMMMMMMMMMMMMNdyyyysyhyyyyyyyyyyhyyddddNMMMMMMMMMMMMMMMMMMMMMM



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
This is the official Accedo AppGrid SDK for Node.js . While AppGrid exposes a set of friendly REST APIs, this SDK is intended to provide a better integration with NodeJS; it also encourages the use of Best-Practices (for example: reusing the same SessionId as much as possible).

## Getting started

  * Clone this repo locally
  * Run `npm install`
  * To run the examples, execute the following command: `npm run runExample`. **NOTE**: This will clean and rebuild the dist folder

## How to use/Examples
Refer to the `examples-es6.js` file for comprehensive examples that cover all of the APIs exported by this module.

#### Options object (required for each call)
An options object must be passed to each AppGrid call. Here's an example (_refer to `example-es6.js` for more details_):
```javascript
import AppGrid from 'appgrid';

const appGridOptions = {
  // NOTE: The following properties are required
  appGridUrl: 'https://appgrid-api.cloud.accedo.tv',
  appId: 'someValidAppGridApplicationId',
  // NOTE: The following properties are optional
  logLevel: 'info'
  sessionId: '', // NOTE: It's ideal to store and reuse the sessionId as much as possible, however a new one will automatically be requested if needed or missing.
  uuid: exampleUuid // NOTE: This value should be unique per end-user. If not provided, a new UUID will be generated for each request.
};


```

#### Get a new AppGrid SessionId
```javascript
AppGrid.session.getSession(appGridOptions)
  .then((newSessionId) => {
    console.log(`\t\t Successfully requested a new Session from AppGrid.\n\t\t   SessionId: ${newSessionId}`);
    appGridOptions.sessionId = newSessionId; // NOTE: Sessions should be reused as much as possible.
  })
  .catch((error) => {
    console.error('Oops! There was an error while requesting a new Session from AppGrid!', error);
  });

```

#### Get all AppGrid Metadata associated with your AppId
```javascript
AppGrid.metadata.getAllMetadata(appGridOptions)
  .then((metadata) => {
    console.log('\t\t Successfully requested all metadata from AppGrid', metadata);
  })
  .catch((error) => {
    logError('Oops! There was an error while requesting all metadata from AppGrid!', error);
  });
```

#### Download an asset from AppGrid
```javascript
import { createWriteStream } from 'fs';

// NOTE: You can get a list of all assets including their IDs by calling the 'getAllAssets' API
const idToDownload = 'someValidAssetId';
const fileName = `downloads/someFilename.png`;

AppGrid.assets.getAssetStreamById(idToDownload, appGridOptions)
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
    console.error('Oops! There was an error while downloading an asset by id from AppGrid!', error);
  });
```

## More information & Links

* [AppGrid Homepage](http://appgrid.accedo.tv/)
* [AppGrid User Guide and API Documentation](https://appgrid.cloud.accedo.tv/help)

## Unit Tests
  Mocha (with Chai) unit tests have been written to cover all of the exported APIs from this module. Follow the following steps in order to run them:

  * Follow the **Getting Started** steps above.
  * Run `npm test`
