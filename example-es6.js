/* eslint-disable no-console, import/no-unresolved, import/no-extraneous-dependencies */

import chalk from 'chalk';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
// NOTE: this would normally be: import appgrid from 'appgrid';
import appgrid from './dist/bundle.es6';

const logError = (message, ...metadata) => {
  console.error(chalk.bgBlack.red.bold(`\t\t ${message}`), ...metadata);
};

const deviceId = appgrid.generateUuid();
const downloadsDirectoryName = 'downloads';

const client = appgrid({
  appKey: '56ea6a370db1bf032c9df5cb',
  deviceId,
  // log(...args) { console.log(...args); },
});

const logExampleCategoryHeader = (message) => {
  console.log();
  console.log(chalk.bgBlack.yellow('\t*************************************************'));
  console.log(chalk.bgBlack.yellow(`\t*   \t${message}`));
  console.log(chalk.bgBlack.yellow('\t*************************************************'));
};

const logExampleHeader = (message) => {
  console.log();
  console.log(`\t\t ${chalk.yellow('Example:')} ${message}`);
};

const exampleAppGridLogging = () => {
  const getLogEventOptions = (message, facilityCode) => { // NOTE: This is simply a convenience/helper method for building a logEvent object.
    const networkErrorCode = '002'; // NOTE: The ErrorCode used must exist within your AppGrid Application's configuration.
    const middlewareSourceCode = 'service-mw'; // NOTE: The SourceCode used must exist within your AppGrid Application's configuration.
    const noneViewName = ''; // NOTE: The ViewName used must exist within your AppGrid Application's configuration.
    const deviceType = 'desktop'; // NOTE: The deviceType used must exist within your AppGrid Application's configuration.
    return {
      message,
      errorCode: networkErrorCode,
      facilityCode, // NOTE: The FacilityCode used must exist within you AppGrid Application's configuration
      dim1: middlewareSourceCode,
      dim2: noneViewName,
      dim3: deviceType,
      dim4: appgrid.getCurrentTimeOfDayDimValue()
    };
  };
  const logFacilityCode = 13;
  logExampleCategoryHeader('AppGrid Logging Examples');

  const getLogLevel = () => {
    logExampleHeader('Requesting the current LogLevel from AppGrid');
    return client.getLogLevel()
      .then((logLevelResponse) => {
        console.log(`\t\t Successfully got the current LogLevel from AppGrid: ${chalk.blue(logLevelResponse)}`);
      })
      .catch((error) => {
        logError('Oops! There was an error while requesting the current LogLevel from AppGrid!', error);
      });
  };

  const sendInfoLogMessage = () => {
    logExampleHeader('Sending an info log message to AppGrid');
    const exampleInfoEventOptions = getLogEventOptions('This is an info log entry!', logFacilityCode);
    return client.sendLog('info', exampleInfoEventOptions)
      .then(() => {
        console.log('\t\t Successfully sent an info log to AppGrid');
      })
      .catch((error) => {
        logError('Oops! There was an error while sending an info log to AppGrid!', error);
      });
  };

  const sendInfoLogMessageWithMetadata = () => {
    logExampleHeader('Sending an info log message with Metadata to AppGrid');
    const exampleInfoEventOptionsWithMetadata = getLogEventOptions('This is an info log entry with Metadata!', logFacilityCode);
    const exampleInfoMetadata = { someMetadataKey: 'someValue' };
    return client.sendLog('info', exampleInfoEventOptionsWithMetadata, exampleInfoMetadata)
      .then(() => {
        console.log('\t\t Successfully sent an info log with Metadata to AppGrid');
      })
      .catch((error) => {
        logError('Oops! There was an error while sending an info log with Metadata to AppGrid!', error);
      });
  };

  return getLogLevel()
    .then(sendInfoLogMessage)
    .then(sendInfoLogMessageWithMetadata)
    .then(() => logExampleCategoryHeader('End AppGrid Logging Examples'));
};

const exampleAppGridEvents = () => {
  logExampleCategoryHeader('AppGrid Event Examples:');

  const sendUsageStartEvent = () => {
    logExampleHeader('Sending a UsageStart Event to AppGrid');
    return client.sendUsageStartEvent()
      .then(() => {
        console.log('\t\t Successfully sent a UsageStart Event to AppGrid');
      })
      .catch((error) => {
        logError('Oops! There was an error while sending a UsageStart event to AppGrid!', error);
      });
  };

  const sendUsageStopEvent = () => {
    return new Promise((resolve) => {
      logExampleHeader('Sending a UsageStop Event to AppGrid');
      const rententionTimeInSeconds = 6;
      console.log(`\t\t Waiting ${rententionTimeInSeconds} second(s) before sending the UsageStop Event.`);
      setTimeout(() => {
        client.sendUsageStopEvent(rententionTimeInSeconds)
          .then(() => {
            console.log('\t\t Successfully sent a UsageStop Event to AppGrid');
            resolve();
          })
          .catch(() => {
            logError('Oops! There was an error while sending a UsageStop Event to AppGrid!');
            resolve();
          });
      }, rententionTimeInSeconds * 1000);
    });
  };

  return sendUsageStartEvent()
    .then(sendUsageStopEvent)
    .then(() => logExampleCategoryHeader('End AppGrid Event Examples'));
};

const exampleAppGridMetadata = () => {
  logExampleCategoryHeader('AppGrid Metadata Examples:');

  const getAllMetadata = () => {
    logExampleHeader('Requesting all metadata from AppGrid');
    return client.getAllMetadata()
      .then((metadata) => {
        console.log('\t\t Successfully requested all metadata from AppGrid', metadata);
      })
      .catch((error) => {
        logError('Oops! There was an error while requesting all metadata from AppGrid!', error);
      });
  };

  const getMetadataByKey = () => {
    logExampleHeader('Requesting metadata by key from AppGrid');
    const keyToFetch = 'android'; // NOTE: The key can be any valid metadata property, including subproperties such as: "someKey.someSubKey" and wildcards, such as: "someKe*"
    return client.getMetadataByKey(keyToFetch)
      .then((metadata) => {
        console.log(`\t\t Successfully requested metadata by key from AppGrid. Key used: ${chalk.blue(keyToFetch)}. \n\t\t Metadata: `, metadata);
      })
      .catch((error) => {
        logError('Oops! There was an error while requesting metadata by key from AppGrid!', error);
      });
  };

  const getMetadataByKeys = () => {
    logExampleHeader('Requesting metadata by multiple keys from AppGrid');
    const keysToFetch = [
      'android',
      'color*'
    ];
    return client.getMetadataByKeys(keysToFetch)
      .then((metadata) => {
        console.log(`\t\t Successfully requested metadata by multiple keys from AppGrid. Keys used: ${chalk.blue(keysToFetch.join(', '))} \n\t\t Metadata: `, metadata);
      })
      .catch((error) => {
        logError('Oops! There was an error while requesting metadata by multiple keys from AppGrid!', error);
      });
  };

  return getAllMetadata()
    .then(getMetadataByKey)
    .then(getMetadataByKeys)
    .then(() => logExampleCategoryHeader('End AppGrid Metadata Examples'));
};

const exampleAppGridAssets = () => {
  logExampleCategoryHeader('AppGrid Asset Examples:');

  const getAllAssets = () => {
    logExampleHeader('Requesting all assets from AppGrid');
    return client.getAllAssets()
      .then((assets) => {
        console.log('\t\t Successfully requested all assets from AppGrid', assets);
      })
      .catch((error) => {
        logError('Oops! There was an error while requesting all assets from AppGrid!', error);
      });
  };

  const getAssetById = () => {
    logExampleHeader('Downloading asset by id from AppGrid');
    const idToDownload = '5566eeaa669ad3b700ddbb11bbff003322cc99ddff55bc7b'; // NOTE: You can get a list of all assets including their IDs by calling the 'getAllAssets' API
    const fileName = `${downloadsDirectoryName}/appLogoLarge.png`;
    return client.getAssetById(idToDownload)
      .then((assetStream) => {
        return new Promise((resolve, reject) => {
          if (!existsSync(downloadsDirectoryName)) { mkdirSync(downloadsDirectoryName); }
          assetStream.pipe(createWriteStream(fileName))
            .on('close', resolve)
            .on('error', reject);
        });
      })
      .then(() => {
        console.log(`\t\t Successfully downloaded an asset by id from AppGrid.\n\t\t AssetId used: ${chalk.blue(idToDownload)}.\n\t\t Filename: ${chalk.blue(fileName)}`);
      })
      .catch((error) => {
        logError('Oops! There was an error while downloading an asset by id from AppGrid!', error);
      });
  };

  return getAllAssets()
    .then(getAssetById)
    .then(() => logExampleCategoryHeader('End AppGrid Asset Examples'));
};

const exampleAppGridContentEntries = () => {
  logExampleCategoryHeader('AppGrid ContentEntries Examples:');

  const getEntryById = () => {
    logExampleHeader('Requesting a ContentEntry by id from AppGrid');
    const idToFetch = '56ea7bd6935f75032a2fd431';
    const isPreview = false; // NOTE: This is an optional parameter. It can be true or false. If set to true the response will return the latest values for this Entry whether it is published or not. Default is false
    const atUtcTime = new Date(); // NOTE: This is an optional parameter. Used to get Entry preview for specific moment of time in past or future. Value is a Date object. Can not be used if "isPreview" is set to true.
    return client.getEntryById(idToFetch, { isPreview, atUtcTime })
      .then((entry) => {
        console.log(`\t\t Successfully requested a ContentEntry by id from AppGrid. Id used: ${chalk.blue(idToFetch)}. \n\t\t ContentEntry: `, entry);
      })
      .catch((error) => {
        logError('Oops! There was an error while requesting a ContentEntry by id from AppGrid!', error);
      });
  };

  const getEntries = () => {
    logExampleHeader('Requesting all ContentEntries from AppGrid');
    const offset = 0; // NOTE: This is the pagination offset used by the AppGrid API. Default is: 0.
    const size = 50; // NOTE: This is used by the AppGrid API to determine the size of the response. Default is: 30
    return client.getEntries({ offset, size })
      .then((response) => {
        const { entries, pagination } = response;
        // NOTE: For a production usage, additional pagination-handling logic would be required to ensure that all entries are fetched.
        console.log(`\t\t Successfully requested all ContentEntries from AppGrid\n\t\t Count of entries recieved: ${chalk.blue(entries.length)} out of ${chalk.blue(pagination.total)} total entries.`);
      })
      .catch((error) => {
        logError('Oops! There was an error while requesting all ContentEntries from AppGrid!', error);
      });
  };

  const getEntriesByIds = () => {
    logExampleHeader('Requesting ContentEntries by multiple ids from AppGrid');
    const params = {
      id: ['56ea7bd6935f75032a2fd431', '56ea7c55935f75032a2fd437'],
      size: 50,
      at: new Date()
    };
    return client.getEntries(params)
      .then((response) => {
        const { entries, pagination } = response;
        // NOTE: For a production usage, additional pagination-handling logic would be required to ensure that all entries are fetched.
        console.log(`\t\t Successfully requested multiple ContentEntries by ids from AppGrid\n\t\t Count of entries recieved: ${chalk.blue(entries.length)} out of ${chalk.blue(pagination.total)} total entries.`);
      })
      .catch((error) => {
        logError('Oops! There was an error while requesting ContentEntries by multiple ids from AppGrid!', error);
      });
  };

  const getEntriesByTypeId = () => {
    logExampleHeader('Requesting ContentEntries by typeId from AppGrid');
    const params = {
      size: 50,
      typeId: '56ea7bca935f75032a2fd42c',
      at: new Date()
    };
    return client.getEntries(params)
      .then((response) => {
        const { entries, pagination } = response;
        // NOTE: For a production usage, additional pagination-handling logic would be required to ensure that all entries are fetched.
        console.log(`\t\t Successfully requested ContentEntries by typeId from AppGrid\n\t\t Count of entries recieved: ${chalk.blue(entries.length)} out of ${chalk.blue(pagination.total)} total entries.`);
      })
      .catch((error) => {
        logError('Oops! There was an error while requesting ContentEntries by typeId from AppGrid!', error);
      });
  };

  return getEntryById()
    .then(getEntries)
    .then(getEntriesByIds)
    .then(getEntriesByTypeId)
    .then(() => logExampleCategoryHeader('End AppGrid ContentEntries Examples'));
};

const exampleAppGridPlugins = () => {
  logExampleCategoryHeader('AppGrid Plugins Examples:');

  const getAllEnabledPlugins = () => {
    logExampleHeader('Requesting all enabled plugins from AppGrid');
    return client.getAllEnabledPlugins()
      .then((plugins) => {
        console.log('\t\t Successfully requested all enabled plugins from AppGrid', plugins);
      })
      .catch((error) => {
        logError('Oops! There was an error while requesting all enabled plugins from AppGrid!', error);
      });
  };

  return getAllEnabledPlugins()
    .then(() => logExampleCategoryHeader('End AppGrid Asset Examples'));
};

const exampleAppGridSessions = () => {
  logExampleCategoryHeader('AppGrid Session Examples:');
  const getAppGridSession = () => {
    logExampleHeader('Requesting a new Session from AppGrid');
    return client.createSession()
      .then((newSessionId) => {
        console.log(`\t\t Successfully requested a new Session from AppGrid.\n\t\t   SessionId: ${chalk.blue(newSessionId)}`);
      })
      .catch((error) => {
        logError('Oops! There was an error while requesting a new Session from AppGrid!', error);
      });
  };

  return getAppGridSession()
    .then(() => {
      logExampleCategoryHeader('End AppGrid Session Examples');
    });
};

const exampleAppGridApplication = () => {
  logExampleCategoryHeader('AppGrid Application Examples:');
  const getAppGridStatus = () => {
    logExampleHeader('Requesting the AppGrid Application Status');
    return client.getApplicationStatus()
      .then((response) => {
        console.log('\t\t Successfully requested the status from AppGrid', response);
      })
      .catch((error) => {
        logError('Oops! There was an error while requesting the status from AppGrid!', error);
      });
  };

  return getAppGridStatus()
    .then(() => { logExampleCategoryHeader('End AppGrid Application Examples'); });
};

const exampleAppGridUserData = () => {
  logExampleCategoryHeader('AppGrid UserData Examples:');
  const userName = 'exampleUser';
  const dataKeyToRequest = 'name';
  const dataKeyToSet = 'packageName';
  const dataValueToSet = 'platinum';
  const userProfileData = {
    name: 'Johnny AppGridUser',
    email: 'johnny.appgriduser@email.com',
    favoriteVideoIds: [
      'abc123',
      '321abc',
      'cba321'
    ]
  };

  const setApplicationScopeUserData = () => {
    logExampleHeader('Setting Application-Scope User Data on AppGrid');
    return client.setApplicationScopeUserData(userName, userProfileData) // WARNING: This will either create (if not already existing) or *overwrite* any existing data!
      .then(() => {
        console.log(`\t\t Successfully set Application-Scope User Data on AppGrid.\n\t\t Username used: ${chalk.blue(userName)}. \n\t\t User data sent: `, userProfileData);
      })
      .catch((error) => {
        logError('Oops! There was an error while setting Application-Scope User Data on AppGrid!', error);
      });
  };

  const setApplicationGroupScopeUserData = () => {
    logExampleHeader('Setting ApplicationGroup-Scope User Data on AppGrid');
    return client.setApplicationGroupScopeUserData(userName, userProfileData) // WARNING: This will either create (if not already existing) or *overwrite* any existing data!
      .then(() => {
        console.log(`\t\t Successfully set ApplicationGroup-Scope User Data on AppGrid.\n\t\t Username used: ${chalk.blue(userName)}. \n\t\t User data sent: `, userProfileData);
      })
      .catch((error) => {
        logError('Oops! There was an error while setting ApplicationGroup-Scope User Data on AppGrid!', error);
      });
  };

  const setApplicationScopeUserDataByKey = () => {
    logExampleHeader('Setting Application-Scope User Data by key on AppGrid');
    return client.setApplicationScopeUserDataByKey(userName, dataKeyToSet, dataValueToSet)
      .then(() => {
        console.log(`\t\t Successfully set Application-Scope User Data by key on AppGrid.\n\t\t Username used: ${chalk.blue(userName)}.\n\t\t Key used: ${chalk.blue(dataKeyToSet)} \n\t\t Value sent: ${chalk.blue(dataValueToSet)}`);
      })
      .catch((error) => {
        logError('Oops! There was an error while setting Application-Scope User Data by key on AppGrid!', error);
      });
  };

  const setApplicationGroupScopeUserDataByKey = () => {
    logExampleHeader('Setting ApplicationGroup-Scope User Data by key on AppGrid');
    return client.setApplicationGroupScopeUserDataByKey(userName, dataKeyToSet, dataValueToSet)
      .then(() => {
        console.log(`\t\t Successfully set ApplicationGroup-Scope User Data by key on AppGrid.\n\t\t Username used: ${chalk.blue(userName)}.\n\t\t Key used: ${chalk.blue(dataKeyToSet)} \n\t\t Value sent: ${chalk.blue(dataValueToSet)}`);
      })
      .catch((error) => {
        logError('Oops! There was an error while setting ApplicationGroup-Scope User Data by key on AppGrid!', error);
      });
  };

  const getAllApplicationScopeDataByUser = () => {
    logExampleHeader('Requesting All Application-Scope Data by user from AppGrid');
    return client.getAllApplicationScopeDataByUser(userName)
      .then((data) => {
        console.log(`\t\t Successfully requested all Application-Scope Data by user from AppGrid.\n\t\t Username used: ${chalk.blue(userName)}. \n\t\t Data: `, data);
      })
      .catch((error) => {
        logError('Oops! There was an error while requesting all Application-Scope Data by user from AppGrid!', error);
      });
  };

  const getAllApplicationGroupScopeDataByUser = () => {
    logExampleHeader('Requesting All ApplicationGroup-Scope Data by user from AppGrid');
    return client.getAllApplicationGroupScopeDataByUser(userName)
      .then((data) => {
        console.log(`\t\t Successfully requested all ApplicationGroup-Scope Data by user from AppGrid.\n\t\t Username used: ${chalk.blue(userName)}. \n\t\t Data: `, data);
      })
      .catch((error) => {
        logError('Oops! There was an error while requesting all ApplicationGroup-Scope Data by user from AppGrid!', error);
      });
  };

  const getApplicationScopeDataByUserAndKey = () => {
    logExampleHeader('Requesting Application-Scope Data by user and key from AppGrid');
    return client.getApplicationScopeDataByUserAndKey(userName, dataKeyToRequest)
      .then((data) => {
        console.log(`\t\t Successfully requested Application-Scope Data by user and key from AppGrid.\n\t\t Username used: ${chalk.blue(userName)}.\n\t\t Data key used: ${chalk.blue(dataKeyToRequest)}. \n\t\t Data: `, data);
      })
      .catch((error) => {
        logError('Oops! There was an error while requesting Application-Scope Data by user and key from AppGrid!', error);
      });
  };

  const getApplicationGroupScopeDataByUserAndKey = () => {
    logExampleHeader('Requesting ApplicationGroup-Scope Data by user and key from AppGrid');
    return client.getApplicationGroupScopeDataByUserAndKey(userName, dataKeyToRequest)
      .then((data) => {
        console.log(`\t\t Successfully requested ApplicationGroup-Scope Data by user and key from AppGrid.\n\t\t Username used: ${chalk.blue(userName)}.\n\t\t Data key used: ${chalk.blue(dataKeyToRequest)}. \n\t\t Data: `, data);
      })
      .catch((error) => {
        logError('Oops! There was an error while requesting ApplicationGroup-Scope Data by user and key from AppGrid!', error);
      });
  };

  return setApplicationScopeUserData()
    .then(setApplicationGroupScopeUserData)
    .then(setApplicationScopeUserDataByKey)
    .then(setApplicationGroupScopeUserDataByKey)
    .then(getAllApplicationScopeDataByUser)
    .then(getAllApplicationGroupScopeDataByUser)
    .then(getApplicationScopeDataByUserAndKey)
    .then(getApplicationGroupScopeDataByUserAndKey)
    .then(() => logExampleCategoryHeader('End AppGrid UserData Examples'));
};

const outputLogo = () => {
  console.log();
  console.log();
  console.log(chalk.bgBlack.yellow('********************************************************************************'));
  console.log();
  console.log();
  console.log(chalk.bgBlack.yellow('    MMMMMMMMMMMMMMMMMMMMMMNNNhhyysyyyyyyyyyyyshhdNNNMMMMMMMMMMMMMMMMMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMMMMMMMMMMMMMNdhyysoooooooooooooooooooooosyyddNMMMMMMMMMMMMMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMMMMMMMMMMmmhysoooooooooooooooooooooooooooooosyhNNMMMMMMMMMMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMMMMMMMNmysoooooooooooooooooooooooooooooooooooooosymNMMMMMMMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMMMMMNhyooooooooooooooooooooooooooooooooooooooooooooyhNMMMMMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMMMNhsooooooooooooooooooooooooooooooooooooooooooooooooyhNMMMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMNhsooooooooooooooooooooooooooooooooooooooooooooooooooo+shNMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMmyooooooooooooooooooooooooooooooooooooooooooooooooooooooooydMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMsyoooooooooooooooooo+++oooooooooooooooo+++ooooooooooooooooooyyMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMdyooooooooooooooo/-`     `-/oooooooo/-`     `-/oooooooooooooooyhMMM '));
  console.log(chalk.bgBlack.yellow('    MMhhoooooooooooooo+.           .+oooo+.           .+ooooooooooooooydMM '));
  console.log(chalk.bgBlack.yellow('    Mdhoooooooooooooo+`             `+oo+`             `+oooooooooooooohdM '));
  console.log(chalk.bgBlack.yellow('    Ndooooooooooooooo:               :oo:               /oooooooooooooooym '));
  console.log(chalk.bgBlack.yellow('    dyooooooooooooooo/               /oo:               /ooooooooooooooosm '));
  console.log(chalk.bgBlack.yellow('    hooooooooooooooooo.             .ooo/`             .oooooooooooooooood '));
  console.log(chalk.bgBlack.yellow('    doooooooooooooooooo:`         `:oo+.             `:ooooooooooooooooood '));
  console.log(chalk.bgBlack.yellow('    d+oooooooooooooooooo+/-.```.-/+o/.    `-/-.```.-/+oooooooooooooooooo+d '));
  console.log(chalk.bgBlack.yellow('    d+oooooooooooooooooooooooooooo/.    `:+oooooooooooooooooooooooossooo+d '));
  console.log(chalk.bgBlack.yellow('    d+oooooooooooooooooo+/-.```.-.    `:+oo+/-.```.-/+oooooooosssyyyyyoo+d '));
  console.log(chalk.bgBlack.yellow('    doooooooooooooooooo:`           `-+oo+:`         `:ooossyyys+:..sysood '));
  console.log(chalk.bgBlack.yellow('    hooooooooooooooooo.             .ooo+.         `.:+syyso/-`     -sysoy '));
  console.log(chalk.bgBlack.yellow('    myooooooooooooooo/               /oo:      .-/osyso/-`     .+o-  :syyd '));
  console.log(chalk.bgBlack.yellow('    myooooooooooooooo:               :oo: `-/osyyyyo.`    -/+` `oys.  /yyh '));
  console.log(chalk.bgBlack.yellow('    Mdhoooooooooooooo+`             `oosssyys+/-`/yy:     .syo` .sys`  /yy '));
  console.log(chalk.bgBlack.yellow('    MMdyoooooooooooooo+.        `.:+syyso/-`      +ys-     -yy+  .syo`.:sy '));
  console.log(chalk.bgBlack.yellow('    MMMhyooooooooooooooo/-. `-/osyysyy+`     /o+  `oys.     :yy/ `+yysyyyy '));
  console.log(chalk.bgBlack.yellow('    MMMMyyooooooooooooooossyyys+/-``+yy-     :sy/  `syo`    `oyysyyyshhdmN '));
  console.log(chalk.bgBlack.yellow('    MMMMMdyooooooooooosyyso/-`   `  `oys.     /so.  .syo.:+syyyssssydNNMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMNysooooooooosyy-     `os+  .sys.     `   `-oyyyyyssooo+smNMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMMMNhyoooooooosys.     :yy/  .syo`     :+syyyssoooooooshdMMMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMMMMMNhyooooooosys`     /ys:  -sy+`    .syysooooooooshNMMMMMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMMMMMMMNmyooooooyyo      +ys:-+syy/`-/+syyysoooooyhmNMMMMMMMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMMMMMMMMMMNNyssooyy/   `-+yyyyyssyyyyyssooooossydNMMMMMMMMMMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMMMMMMMMMMMMMNmdyyyy++syyysssoooosssooooosyydmNMMMMMMMMMMMMMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMMMMMMMMMMMMMMMMNdyyyysyhyyyyyyyyyyhyyddddNMMMMMMMMMMMMMMMMMMMMMM '));
  console.log();
  console.log(chalk.bgBlack.yellow('       $$$$$$\\                       $$$$$$\\            $$\\       $$\\ '));
  console.log(chalk.bgBlack.yellow('      $$  __$$\\                     $$  __$$\\           \\__|      $$ | '));
  console.log(chalk.bgBlack.yellow('      $$ /  $$ | $$$$$$\\   $$$$$$\\  $$ /  \\__| $$$$$$\\  $$\\  $$$$$$$ | '));
  console.log(chalk.bgBlack.yellow('      $$$$$$$$ |$$  __$$\\ $$  __$$\\ $$ |$$$$\\ $$  __$$\\ $$ |$$  __$$ | '));
  console.log(chalk.bgBlack.yellow('      $$  __$$ |$$ /  $$ |$$ /  $$ |$$ |\\_$$ |$$ |  \\__|$$ |$$ /  $$ | '));
  console.log(chalk.bgBlack.yellow('      $$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |      $$ |$$ |  $$ | '));
  console.log(chalk.bgBlack.yellow('      $$ |  $$ |$$$$$$$  |$$$$$$$  |\\$$$$$$  |$$ |      $$ |\\$$$$$$$ | '));
  console.log(chalk.bgBlack.yellow('      \\__|  \\__|$$  ____/ $$  ____/  \\______/ \\__|      \\__| \\_______| '));
  console.log(chalk.bgBlack.yellow('                $$ |      $$ | '));
  console.log(chalk.bgBlack.yellow('                $$ |      $$ | '));
  console.log(chalk.bgBlack.yellow('                \\__|      \\__| '));
  console.log();
  console.log(chalk.bgBlack.yellow('********************************************************************************'));
  console.log();
  console.log();
};

const runAllExamples = () => {
  outputLogo();
  exampleAppGridSessions()
    .then(exampleAppGridApplication)
    .then(exampleAppGridLogging)
    .then(exampleAppGridEvents)
    .then(exampleAppGridMetadata)
    .then(exampleAppGridAssets)
    .then(exampleAppGridContentEntries)
    .then(exampleAppGridPlugins)
    .then(exampleAppGridUserData)
    .catch((error) => {
      logError('Oops! There was an unhandled error during one of the examples!', error);
    })
    .then(() => {
      console.log();
      console.log(chalk.bgBlack.yellow('********************************************************************************'));
      console.log(chalk.bgBlack.yellow('\t\t\tDONE WITH ALL EXAMPLES'));
      console.log(chalk.bgBlack.yellow('********************************************************************************'));
    });
};
runAllExamples();
