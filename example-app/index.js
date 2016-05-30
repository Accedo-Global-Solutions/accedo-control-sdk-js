/* eslint-disable no-console, no-unused-expressions */

'use strict';

var AppGrid = require('appgrid');
var chalk = require('chalk');
var fs = require('fs');
var Promise = require('es6-promise').Promise;

/* // NOTE: Uncomment this block, and the 'debugLogger' line inside of the appGridOptions, below in order to show debug logs in the console.
 var debugLogger = function (message, ...metadata) {
    console.log(chalk.bgBlack.white('\t\tAppGrid DEBUG: ' + message), ...metadata);
 };
 */

function logError (message, metadata) {
  console.error(chalk.bgBlack.red.bold('\t\t ' + message), metadata);
}

var exampleUuid = AppGrid.session.generateUuid();

var downloadsDirectoryName = 'downloads';

var appGridOptions = {
  // NOTE: The following properties are required
  appGridUrl: 'https://appgrid-api.cloud.accedo.tv',
  appId: '56ea6a370db1bf032c9df5cb',

  // NOTE: The following properties are optional
  logLevel: 'info', // This will default to: 'info' if not provided
  /* Here are the possible values for logLevel (NOTE: there is a corresponding AppGrid.logger.'level' function for each, apart from 'off') :
   debug,
   info,
   warn,
   error,
   off
   */
  clientIp: '', // NOTE: If provided, this value will be inserted into the X-FORWARDED-FOR header for all AppGrid API Calls
  sessionId: '', // NOTE: It's ideal to store and reuse the sessionId as much as possible, however a new one will automatically be requested if needed or missing.
  gid: '', // NOTE: Refer to the AppGrid documentation on how to optionally make use of a GID.
  uuid: exampleUuid // NOTE: This value should be unique per end-user. If not provided, a new UUID will be generated for each request.
  // debugLogger // NOTE: This is for capturing any debug messages from the AppGrid library. If not defined, a no-op will be used instead.
};

var logExampleCategoryHeader = function (message) {
  console.log();
  console.log(chalk.bgBlack.yellow('\t*************************************************'));
  console.log(chalk.bgBlack.yellow('\t*   \t' + message));
  console.log(chalk.bgBlack.yellow('\t*************************************************'));
};

var logExampleHeader = function (message) {
  console.log();
  console.log('\t\t ' + chalk.yellow('Example:') + ' ' + message);
};

var exampleAppGridLogging = function () {
  var getLogEventOptions = function (message, facilityCode) { // NOTE: This is simply a convenience/helper method for building a logEvent object.
    var networkErrorCode = '002'; // NOTE: The ErrorCode used must exist within your AppGrid Application's configuration.
    var middlewareSourceCode = 'service-mw'; // NOTE: The SourceCode used must exist within your AppGrid Application's configuration.
    var noneViewName = ''; // NOTE: The ViewName used must exist within your AppGrid Application's configuration.
    var deviceType = 'desktop'; // NOTE: The deviceType used must exist within your AppGrid Application's configuration.
    return {
      message: message,
      errorCode: networkErrorCode,
      facilityCode: facilityCode, // NOTE: The FacilityCode used must exist within you AppGrid Application's configuration
      dim1: middlewareSourceCode,
      dim2: noneViewName,
      dim3: deviceType,
      dim4: AppGrid.logUtils.getCurrentTimeOfDayDimValue()
    };
  };
  var logFacilityCode = 13;
  logExampleCategoryHeader('AppGrid Logging Examples');

  var getLogLevel = function () {
    logExampleHeader('Requesting the current LogLevel from AppGrid');
    return AppGrid.logUtils.getLogLevel(appGridOptions)
      .then(function (logLevelResponse) {
        console.log('\t\t Successfully got the current LogLevel from AppGrid: ' + chalk.blue(logLevelResponse));
        appGridOptions.logLevel = logLevelResponse;
      })
      .catch(function (error) {
        logError('Oops! There was an error while requesting the current LogLevel from AppGrid!', error);
      });
  };

  var sendInfoLogMessage = function () {
    logExampleHeader('Sending an info log message to AppGrid');
    var exampleInfoEventOptions = getLogEventOptions('This is an info log entry!', logFacilityCode);
    return AppGrid.logger.info(appGridOptions, exampleInfoEventOptions)
      .then(function () {
        console.log('\t\t Successfully sent an info log to AppGrid');
      })
      .catch(function (error) {
        logError('Oops! There was an error while sending an info log to AppGrid!', error);
      });
  };

  var sendInfoLogMessageWithMetadata = function () {
    logExampleHeader('Sending an info log message with Metadata to AppGrid');
    var exampleInfoEventOptionsWithMetadata = getLogEventOptions('This is an info log entry with Metadata!', logFacilityCode);
    var exampleInfoMetadata = { someMetadataKey: 'someValue' };
    return AppGrid.logger.info(appGridOptions, exampleInfoEventOptionsWithMetadata, exampleInfoMetadata)
      .then(function () {
        console.log('\t\t Successfully sent an info log with Metadata to AppGrid');
      })
      .catch(function (error) {
        logError('Oops! There was an error while sending an info log with Metadata to AppGrid!', error);
      });
  };

  var logEndHeader = function () {
    logExampleCategoryHeader('End AppGrid Logging Examples');
  };

  return getLogLevel()
    .then(sendInfoLogMessage)
    .then(sendInfoLogMessageWithMetadata)
    .then(logEndHeader);
};

var exampleAppGridEvents = function () {
  logExampleCategoryHeader('AppGrid Event Examples:');

  var sendUsageStartEvent = function () {
    logExampleHeader('Sending a UsageStart Event to AppGrid');
    return AppGrid.events.sendUsageStartEvent(appGridOptions)
      .then(function () {
        console.log('\t\t Successfully sent a UsageStart Event to AppGrid');
      })
      .catch(function (error) {
        logError('Oops! There was an error while sending a UsageStart event to AppGrid!', error);
      });
  };

  var sendUsageStopEvent = function () {
    return new Promise(function (resolve) {
      logExampleHeader('Sending a UsageStop Event to AppGrid');
      var rententionTimeInSeconds = 6;
      console.log('\t\t Waiting ' + rententionTimeInSeconds + ' second(s) before sending the UsageStop Event.');
      setTimeout(function () {
        AppGrid.events.sendUsageStopEvent(appGridOptions, rententionTimeInSeconds)
          .then(function () {
            console.log('\t\t Successfully sent a UsageStop Event to AppGrid');
            resolve();
          })
          .catch(function () {
            logError('Oops! There was an error while sending a UsageStop Event to AppGrid!');
            resolve();
          });
      }, rententionTimeInSeconds * 1000);
    });
  };

  var logEndHeader = function () {
    logExampleCategoryHeader('End AppGrid Event Examples');
  };

  return sendUsageStartEvent()
    .then(sendUsageStopEvent)
    .then(logEndHeader);
};

var exampleAppGridProfile = function () {
  logExampleCategoryHeader('AppGrid Profile Examples:');

  var getProfileInfo = function () {
    logExampleHeader('Requesting Profile information from AppGrid');
    return AppGrid.profile.getProfileInfo(appGridOptions)
      .then(function (data) {
        console.log('\t\t Successfully requested Profile information from AppGrid.\n\t\t Profile info: ', data);
      })
      .catch(function (error) {
        logError('Oops! There was an error while requesting Profile information from AppGrid!', error);
      });
  };

  var logEndHeader = function () {
    logExampleCategoryHeader('End AppGrid Profile Examples');
  };

  return getProfileInfo()
    .then(logEndHeader);
};

var exampleAppGridMetadata = function () {
  logExampleCategoryHeader('AppGrid Metadata Examples:');

  var getAllMetadata = function () {
    logExampleHeader('Requesting all metadata from AppGrid');
    return AppGrid.metadata.getAllMetadata(appGridOptions)
      .then(function (metadata) {
        console.log('\t\t Successfully requested all metadata from AppGrid', metadata);
      })
      .catch(function (error) {
        logError('Oops! There was an error while requesting all metadata from AppGrid!', error);
      });
  };

  var getMetadataByKey = function () {
    logExampleHeader('Requesting metadata by key from AppGrid');
    var keyToFetch = 'android'; // NOTE: The key can be any valid metadata property, including subproperties such as: "someKey.someSubKey" and wildcards, such as: "someKe*"
    return AppGrid.metadata.getMetadataByKey(appGridOptions, keyToFetch)
      .then(function (metadata) {
        console.log('\t\t Successfully requested metadata by key from AppGrid. Key used: ' + chalk.blue(keyToFetch) + '. \n\t\t Metadata: ', metadata);
      })
      .catch(function (error) {
        logError('Oops! There was an error while requesting metadata by key from AppGrid!', error);
      });
  };

  var getMetadataByKeys = function () {
    logExampleHeader('Requesting metadata by multiple keys from AppGrid');
    var keysToFetch = [
      'android',
      'color*'
    ];
    return AppGrid.metadata.getMetadataByKeys(appGridOptions, keysToFetch)
      .then(function (metadata) {
        console.log('\t\t Successfully requested metadata by multiple keys from AppGrid. Keys used: ' + chalk.blue(keysToFetch.join(', ')) + ' \n\t\t Metadata: ', metadata);
      })
      .catch(function (error) {
        logError('Oops! There was an error while requesting metadata by multiple keys from AppGrid!', error);
      });
  };

  var logEndHeader = function () {
    logExampleCategoryHeader('End AppGrid Metadata Examples');
  };

  return getAllMetadata()
    .then(getMetadataByKey)
    .then(getMetadataByKeys)
    .then(logEndHeader);
};

var exampleAppGridAssets = function () {
  logExampleCategoryHeader('AppGrid Asset Examples:');

  var getAllAssets = function () {
    logExampleHeader('Requesting all assets from AppGrid');
    return AppGrid.assets.getAllAssets(appGridOptions)
      .then(function (assets) {
        console.log('\t\t Successfully requested all assets from AppGrid', assets);
      })
      .catch(function (error) {
        logError('Oops! There was an error while requesting all assets from AppGrid!', error);
      });
  };

  var getAssetStreamById = function () {
    logExampleHeader('Downloading asset by id from AppGrid');
    var idToDownload = '5566eeaa669ad3b700ddbb11bbff003322cc99ddff55bc7b'; // NOTE: You can get a list of all assets including their IDs by calling the 'getAllAssets' API
    var fileName = downloadsDirectoryName + '/appLogoLarge.png';
    return AppGrid.assets.getAssetStreamById(idToDownload, appGridOptions)
      .then(function (assetStream) {
        return new Promise(function (resolve, reject) {
          fs.existsSync(downloadsDirectoryName) || fs.mkdirSync(downloadsDirectoryName);
          assetStream.pipe(fs.createWriteStream(fileName))
            .on('close', resolve)
            .on('error', reject);
        });
      })
      .then(function () {
        console.log('\t\t Successfully downloaded an asset by id from AppGrid.\n\t\t AssetId used: ' + chalk.blue(idToDownload) + '.\n\t\t Filename: ' + chalk.blue(fileName));
      })
      .catch(function (error) {
        logError('Oops! There was an error while downloading an asset by id from AppGrid!', error);
      });
  };

  var logEndHeader = function () {
    logExampleCategoryHeader('End AppGrid Asset Examples');
  };

  return getAllAssets()
    .then(getAssetStreamById)
    .then(logEndHeader);
};

var exampleAppGridContentEntries = function () {
  logExampleCategoryHeader('AppGrid ContentEntries Examples:');

  var getAllEntries = function () {
    logExampleHeader('Requesting all ContentEntries from AppGrid');
    var offset = 0; // NOTE: This is the pagination offset used by the AppGrid API. Default is: 0.
    var countOfResults = 50; // NOTE: This is used by the AppGrid API to determine the size of the response. Default is: 30
    return AppGrid.contentEntries.getAllEntries(appGridOptions, offset, countOfResults)
      .then(function (response) {
        var entries = response.json.entries;
        var pagination = response.json.pagination;
        // NOTE: For a production usage, additional pagination-handling logic would be required to ensure that all entries are fetched.
        console.log('\t\t Successfully requested all ContentEntries from AppGrid\n\t\t Count of entries received: ' + chalk.blue(entries.length) + ' out of ' + chalk.blue(pagination.total) + ' total entries.');
      })
      .catch(function (error) {
        logError('Oops! There was an error while requesting all ContentEntries from AppGrid!', error);
      });
  };

  var getEntryById = function () {
    logExampleHeader('Requesting a ContentEntry by id from AppGrid');
    var idToFetch = '56ea7bd6935f75032a2fd431';
    var isPreview = false; // NOTE: This is an optional parameter. It can be true or false. If set to true the response will return the latest values for this Entry whether it is published or not. Default is false
    var atUtcTime = new Date(); // NOTE: This is an optional parameter. Used to get Entry preview for specific moment of time in past or future. Value is a Date object. Can not be used if "isPreview" is set to true.
    return AppGrid.contentEntries.getEntryById(appGridOptions, idToFetch, isPreview, atUtcTime)
      .then(function (entry) {
        console.log('\t\t Successfully requested a ContentEntry by id from AppGrid. Id used: ' + chalk.blue(idToFetch) + '. \n\t\t ContentEntry: ', entry);
      })
      .catch(function (error) {
        logError('Oops! There was an error while requesting a ContentEntry by id from AppGrid!', error);
      });
  };

  var getEntriesByIds = function () {
    logExampleHeader('Requesting ContentEntries by multiple ids from AppGrid');
    var idsToFetch = [
      '56ea7bd6935f75032a2fd431',
      '56ea7c55935f75032a2fd437'
    ];
    var offset = 0; // NOTE: This is the pagination offset used by the AppGrid API. Default is: 0.
    var countOfResults = 50; // NOTE: This is used by the AppGrid API to determine the size of the response. Default is: 30
    var isPreview = false; // NOTE: This is an optional parameter. It can be true or false. If set to true the response will return the latest values for this Entry whether it is published or not. Default is false
    var atUtcTime = new Date(); // NOTE: This is an optional parameter. Used to get Entry preview for specific moment of time in past or future. Value is a Date object. Can not be used if "isPreview" is set to true.
    return AppGrid.contentEntries.getEntriesByIds(appGridOptions, idsToFetch, offset, countOfResults, isPreview, atUtcTime)
      .then(function (response) {
        var entries = response.json.entries;
        var pagination = response.json.pagination;
        // NOTE: For a production usage, additional pagination-handling logic would be required to ensure that all entries are fetched.
        console.log('\t\t Successfully requested multiple ContentEntries by ids from AppGrid\n\t\t Count of entries received: ' + chalk.blue(entries.length) + ' out of ' + chalk.blue(pagination.total) + ' total entries.');
      })
      .catch(function (error) {
        logError('Oops! There was an error while requesting ContentEntries by multiple ids from AppGrid!', error);
      });
  };

  var getEntriesByTypeId = function () {
    logExampleHeader('Requesting ContentEntries by typeId from AppGrid');
    var typeIdToFetch = '56ea7bca935f75032a2fd42c';
    var offset = 0; // NOTE: This is the pagination offset used by the AppGrid API. Default is: 0.
    var countOfResults = 50; // NOTE: This is used by the AppGrid API to determine the size of the response. Default is: 30
    var isPreview = false; // NOTE: This is an optional parameter. It can be true or false. If set to true the response will return the latest values for this Entry whether it is published or not. Default is false
    var atUtcTime = new Date(); // NOTE: This is an optional parameter. Used to get Entry preview for specific moment of time in past or future. Value is a Date object. Can not be used if "isPreview" is set to true.
    return AppGrid.contentEntries.getEntriesByTypeId(appGridOptions, typeIdToFetch, offset, countOfResults, isPreview, atUtcTime)
      .then(function (response) {
        var entries = response.json.entries;
        var pagination = response.json.pagination;
        // NOTE: For a production usage, additional pagination-handling logic would be required to ensure that all entries are fetched.
        console.log('\t\t Successfully requested ContentEntries by typeId from AppGrid\n\t\t Count of entries received: ' + chalk.blue(entries.length) + ' out of ' + chalk.blue(pagination.total) + ' total entries.');
      })
      .catch(function (error) {
        logError('Oops! There was an error while requesting ContentEntries by typeId from AppGrid!', error);
      });
  };

  var logEndHeader = function () {
    logExampleCategoryHeader('End AppGrid ContentEntries Examples');
  };

  return getAllEntries()
    .then(getEntryById)
    .then(getEntriesByIds)
    .then(getEntriesByTypeId)
    .then(logEndHeader);
};

var exampleAppGridPlugins = function () {
  logExampleCategoryHeader('AppGrid Plugins Examples:');

  var getAllEnabledPlugins = function () {
    logExampleHeader('Requesting all enabled plugins from AppGrid');
    return AppGrid.plugins.getAllEnabledPlugins(appGridOptions)
      .then(function (plugins) {
        console.log('\t\t Successfully requested all enabled plugins from AppGrid', plugins);
      })
      .catch(function (error) {
        logError('Oops! There was an error while requesting all enabled plugins from AppGrid!', error);
      });
  };

  return getAllEnabledPlugins()
    .then(function () { logExampleCategoryHeader('End AppGrid Asset Examples'); });
};

var exampleAppGridSessions = function () {
  logExampleCategoryHeader('AppGrid Session Examples:');
  var getAppGridSession = function () {
    logExampleHeader('Requesting a new Session from AppGrid');
    return AppGrid.session.getSession(appGridOptions)
      .then(function (newSessionId) {
        console.log('\t\t Successfully requested a new Session from AppGrid.\n\t\t   SessionId: ' + chalk.blue(newSessionId));
        appGridOptions.sessionId = newSessionId; // NOTE: Sessions should be reused as much as possible.
      })
      .catch(function (error) {
        logError('Oops! There was an error while requesting a new Session from AppGrid!', error);
      });
  };
  var getAppGridStatus = function () {
    logExampleHeader('Requesting AppGrid\'s Status');
    return AppGrid.session.getStatus(appGridOptions)
      .then(function (response) {
        console.log('\t\t Successfully requested the status from AppGrid', response);
      })
      .catch(function (error) {
        logError('Oops! There was an error while requesting the status from AppGrid!', error);
      });
  };
  var validateAppGridSession = function () {
    logExampleHeader('Validating an AppGrid Session for the following SessionId: \n\t\t  ' + chalk.blue(appGridOptions.sessionId));
    return AppGrid.session.validateSession(appGridOptions)
      .then(function (isValid) {
        console.log('\t\t Is this AppGrid Session valid? ' + chalk.blue(isValid));
      })
      .catch(function (error) {
        logError('Oops! There was an error while attempting to validate the AppGrid Session!', error);
      });
  };
  var updateAppGridSessionUuid = function () {
    var newUuid = AppGrid.session.generateUuid();
    logExampleHeader('Updating the UUID associated with an AppGrid Session\n\t\t For the following SessionId: ' + chalk.blue(appGridOptions.sessionId) + ' \n\t\t With the following UUID: ' + chalk.blue(newUuid));
    appGridOptions.uuid = newUuid;
    return AppGrid.session.updateSessionUuid(appGridOptions)
      .then(function (response) {
        console.log('\t\t Successfully updated the UUID associated with this AppGrid Session', response);
      })
      .catch(function (error) {
        logError('Oops! There was an error while attempting to update the UUID associated with this AppGrid Session!', error);
      });
  };

  var logEndHeader = function () {
    logExampleCategoryHeader('End AppGrid Session Examples');
  };

  return getAppGridSession()
    .then(getAppGridStatus)
    .then(validateAppGridSession)
    .then(updateAppGridSessionUuid)
    .then(logEndHeader);
};

var exampleAppGridUserData = function () {
  logExampleCategoryHeader('AppGrid UserData Examples:');
  var userName = 'exampleUser';
  var dataKeyToRequest = 'name';
  var dataKeyToSet = 'packageName';
  var dataValueToSet = 'platinum';
  var userProfileData = {
    name: 'Johnny AppGridUser',
    email: 'johnny.appgriduser@email.com',
    favoriteVideoIds: [
      'abc123',
      '321abc',
      'cba321'
    ]
  };

  var setApplicationScopeUserData = function () {
    logExampleHeader('Setting Application-Scope User Data on AppGrid');
    return AppGrid.userData.setApplicationScopeUserData(appGridOptions, userName, userProfileData) // WARNING: This will either create (if not already existing) or *overwrite* any existing data!
      .then(function () {
        console.log('\t\t Successfully set Application-Scope User Data on AppGrid.\n\t\t Username used: ' + chalk.blue(userName) + '. \n\t\t User data sent: ', userProfileData);
      })
      .catch(function (error) {
        logError('Oops! There was an error while setting Application-Scope User Data on AppGrid!', error);
      });
  };

  var setApplicationGroupScopeUserData = function () {
    logExampleHeader('Setting ApplicationGroup-Scope User Data on AppGrid');
    return AppGrid.userData.setApplicationGroupScopeUserData(appGridOptions, userName, userProfileData) // WARNING: This will either create (if not already existing) or *overwrite* any existing data!
      .then(function () {
        console.log('\t\t Successfully set ApplicationGroup-Scope User Data on AppGrid.\n\t\t Username used: ' + chalk.blue(userName) + '. \n\t\t User data sent: ', userProfileData);
      })
      .catch(function (error) {
        logError('Oops! There was an error while setting ApplicationGroup-Scope User Data on AppGrid!', error);
      });
  };

  var setApplicationScopeUserDataByKey = function () {
    logExampleHeader('Setting Application-Scope User Data by key on AppGrid');
    return AppGrid.userData.setApplicationScopeUserDataByKey(appGridOptions, userName, dataKeyToSet, dataValueToSet)
      .then(function () {
        console.log('\t\t Successfully set Application-Scope User Data by key on AppGrid.\n\t\t Username used: ' + chalk.blue(userName) + '.\n\t\t Key used: ' + chalk.blue(dataKeyToSet) + '  \n\t\t Value sent: ' + chalk.blue(dataValueToSet));
      })
      .catch(function (error) {
        logError('Oops! There was an error while setting Application-Scope User Data by key on AppGrid!', error);
      });
  };

  var setApplicationGroupScopeUserDataByKey = function () {
    logExampleHeader('Setting ApplicationGroup-Scope User Data by key on AppGrid');
    return AppGrid.userData.setApplicationGroupScopeUserDataByKey(appGridOptions, userName, dataKeyToSet, dataValueToSet)
      .then(function () {
        console.log('\t\t Successfully set ApplicationGroup-Scope User Data by key on AppGrid.\n\t\t Username used: ' + chalk.blue(userName) + '.\n\t\t Key used: ' + chalk.blue(dataKeyToSet) + ' \n\t\t Value sent: ' + chalk.blue(dataValueToSet));
      })
      .catch(function (error) {
        logError('Oops! There was an error while setting ApplicationGroup-Scope User Data by key on AppGrid!', error);
      });
  };

  var getAllApplicationScopeDataByUser = function () {
    logExampleHeader('Requesting All Application-Scope Data by user from AppGrid');
    return AppGrid.userData.getAllApplicationScopeDataByUser(appGridOptions, userName)
      .then(function (data) {
        console.log('\t\t Successfully requested all Application-Scope Data by user from AppGrid.\n\t\t Username used: ' + chalk.blue(userName) + '. \n\t\t Data: ', data);
      })
      .catch(function (error) {
        logError('Oops! There was an error while requesting all Application-Scope Data by user from AppGrid!', error);
      });
  };

  var getAllApplicationGroupScopeDataByUser = function () {
    logExampleHeader('Requesting All ApplicationGroup-Scope Data by user from AppGrid');
    return AppGrid.userData.getAllApplicationGroupScopeDataByUser(appGridOptions, userName)
      .then(function (data) {
        console.log('\t\t Successfully requested all ApplicationGroup-Scope Data by user from AppGrid.\n\t\t Username used: ' + chalk.blue(userName) + '. \n\t\t Data: ', data);
      })
      .catch(function (error) {
        logError('Oops! There was an error while requesting all ApplicationGroup-Scope Data by user from AppGrid!', error);
      });
  };

  var getApplicationScopeDataByUserAndKey = function () {
    logExampleHeader('Requesting Application-Scope Data by user and key from AppGrid');
    return AppGrid.userData.getApplicationScopeDataByUserAndKey(appGridOptions, userName, dataKeyToRequest)
      .then(function (data) {
        console.log('\t\t Successfully requested Application-Scope Data by user and key from AppGrid.\n\t\t Username used: ' + chalk.blue(userName) + '.\n\t\t Data key used: ' + chalk.blue(dataKeyToRequest) + '. \n\t\t Data: ', data);
      })
      .catch(function (error) {
        logError('Oops! There was an error while requesting Application-Scope Data by user and key from AppGrid!', error);
      });
  };

  var getApplicationGroupScopeDataByUserAndKey = function () {
    logExampleHeader('Requesting ApplicationGroup-Scope Data by user and key from AppGrid');
    return AppGrid.userData.getApplicationGroupScopeDataByUserAndKey(appGridOptions, userName, dataKeyToRequest)
      .then(function (data) {
        console.log('\t\t Successfully requested ApplicationGroup-Scope Data by user and key from AppGrid.\n\t\t Username used: ' + chalk.blue(userName) + '.\n\t\t Data key used: ' + chalk.blue(dataKeyToRequest) + '. \n\t\t Data: ', data);
      })
      .catch(function (error) {
        logError('Oops! There was an error while requesting ApplicationGroup-Scope Data by user and key from AppGrid!', error);
      });
  };

  var logEndHeader = function () {
    logExampleCategoryHeader('End AppGrid UserData Examples');
  };

  return setApplicationScopeUserData()
    .then(setApplicationGroupScopeUserData)
    .then(setApplicationScopeUserDataByKey)
    .then(setApplicationGroupScopeUserDataByKey)
    .then(getAllApplicationScopeDataByUser)
    .then(getAllApplicationGroupScopeDataByUser)
    .then(getApplicationScopeDataByUserAndKey)
    .then(getApplicationGroupScopeDataByUserAndKey)
    .then(logEndHeader);
};

function outputLogo () {
  console.log();
  console.log();
  console.log(chalk.bgBlack.yellow('********************************************************************************'));
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
  console.log();
  console.log(chalk.bgBlack.yellow('                ES5 Example Consumer Application '));
  console.log(chalk.bgBlack.yellow('********************************************************************************'));
  console.log();
  console.log();
}

function runAllExamples () {
  outputLogo();
  exampleAppGridSessions()
    .then(exampleAppGridLogging)
    .then(exampleAppGridProfile)
    .then(exampleAppGridEvents)
    .then(exampleAppGridMetadata)
    .then(exampleAppGridAssets)
    .then(exampleAppGridContentEntries)
    .then(exampleAppGridPlugins)
    .then(exampleAppGridUserData)
    .catch(function (error) {
      logError('Oops! There was an unhandled error during one of the examples!', error);
    })
    .then(function () {
      console.log();
      console.log(chalk.bgBlack.yellow('********************************************************************************'));
      console.log(chalk.bgBlack.yellow('\t\t\tDONE WITH ALL EXAMPLES'));
      console.log(chalk.bgBlack.yellow('********************************************************************************'));
    });
}
runAllExamples();
