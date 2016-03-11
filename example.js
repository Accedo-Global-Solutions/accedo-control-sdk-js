'use strict';

var _index = require('./dist/index');

var _index2 = _interopRequireDefault(_index);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// NOTE: this would normally be: import AppGrid from 'appgrid';


console.dir(_index2.default); // TODO JASON: Kill this line

/* eslint-disable no-console, no-unused-expressions, no-unused-vars */

// TODO JASON: remove 'no-unused-vars' from the disable comment above

var debugLogger = function debugLogger(message) {
  var _console;

  for (var _len = arguments.length, metadata = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    metadata[_key - 1] = arguments[_key];
  }

  (_console = console).log.apply(_console, [_chalk2.default.bgBlack.white('\t\tAppGrid DEBUG: ' + message + ' ')].concat(metadata));
};

var logError = function logError(message) {
  var _console2;

  for (var _len2 = arguments.length, metadata = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    metadata[_key2 - 1] = arguments[_key2];
  }

  (_console2 = console).error.apply(_console2, [_chalk2.default.bgBlack.red.bold('\t\t ' + message)].concat(metadata));
};

var exampleUuid = _index2.default.session.generateUuid();
var downloadsDirectoryName = 'downloads';

var appGridOptions = { // TODO JASON: Finish updating these values
  // NOTE: The following properties are required
  appGridUrl: 'https://appgrid-api.cloud.accedo.tv',
  appId: '560e505de4b0150cbb576df5', // TODO JASON: CRITICAL: MAKE SURE TO UPDATE THIS TO THE PROPER EXAMPLE APPID!!!!!!!1! (Currently this is the VIA-Go dev AppId)

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
  uuid: exampleUuid, // NOTE: This value should be unique per end-user. If not provided, a new UUID will be generated for each request.
  debugLogger: debugLogger // NOTE: This is for capturing any debug messages from the AppGrid library. If not defined, a no-op will be used instead.
};

var logExampleCategoryHeader = function logExampleCategoryHeader(message) {
  console.log();
  console.log(_chalk2.default.bgBlack.yellow('\t*************************************************'));
  console.log(_chalk2.default.bgBlack.yellow('\t*   \t' + message));
  console.log(_chalk2.default.bgBlack.yellow('\t*************************************************'));
};

var logExampleHeader = function logExampleHeader(message) {
  console.log();
  console.log('\t\t ' + _chalk2.default.yellow('Example:') + ' ' + message);
};

var exampleAppGridLogging = function exampleAppGridLogging() {
  var getLogEventOptions = function getLogEventOptions(message, facilityCode) {
    // NOTE: This is simply a convenience/helper method for building a logEvent object.
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
      dim4: _index2.default.logUtils.getCurrentTimeOfDayDimValue()
    };
  };
  var logFacilityCode = 13;
  logExampleCategoryHeader('AppGrid Logging Examples');

  var getLogLevel = function getLogLevel() {
    logExampleHeader('Requesting the current LogLevel from AppGrid');
    return _index2.default.logUtils.getLogLevel(appGridOptions).then(function (logLevelResponse) {
      console.log('\t\t Successfully got the current LogLevel from AppGrid: ' + _chalk2.default.blue(logLevelResponse));
      appGridOptions.logLevel = logLevelResponse;
    }).catch(function (error) {
      logError('Oops! There was an error while requesting the current LogLevel from AppGrid!', error);
    });
  };

  var sendInfoLogMessage = function sendInfoLogMessage() {
    logExampleHeader('Sending an info log message to AppGrid');
    var exampleInfoEventOptions = getLogEventOptions('This is an info log entry!', logFacilityCode);
    return _index2.default.logger.info(exampleInfoEventOptions, appGridOptions).then(function () {
      console.log('\t\t Successfully sent an info log to AppGrid');
    }).catch(function (error) {
      logError('Oops! There was an error while sending an info log to AppGrid!', error);
    });
  };

  var sendInfoLogMessageWithMetadata = function sendInfoLogMessageWithMetadata() {
    logExampleHeader('Sending an info log message with Metadata to AppGrid');
    var exampleInfoEventOptionsWithMetadata = getLogEventOptions('This is an info log entry with Metadata!', logFacilityCode);
    var exampleInfoMetadata = { someMetadataKey: 'someValue' };
    return _index2.default.logger.info(exampleInfoEventOptionsWithMetadata, appGridOptions, exampleInfoMetadata).then(function () {
      console.log('\t\t Successfully sent an info log with Metadata to AppGrid');
    }).catch(function (error) {
      logError('Oops! There was an error while sending an info log with Metadata to AppGrid!', error);
    });
  };

  return getLogLevel().then(sendInfoLogMessage).then(sendInfoLogMessageWithMetadata).then(function () {
    return logExampleCategoryHeader('End AppGrid Logging Examples');
  });
};

var exampleAppGridEvents = function exampleAppGridEvents() {
  logExampleCategoryHeader('AppGrid Event Examples:');

  var sendUsageStartEvent = function sendUsageStartEvent() {
    logExampleHeader('Sending a UsageStart Event to AppGrid');
    return _index2.default.events.sendUsageStartEvent(appGridOptions).then(function () {
      console.log('\t\t Successfully sent a UsageStart Event to AppGrid');
    }).catch(function (error) {
      logError('Oops! There was an error while sending a UsageStart event to AppGrid!', error);
    });
  };

  var sendUsageStopEvent = function sendUsageStopEvent() {
    return new Promise(function (resolve) {
      logExampleHeader('Sending a UsageStop Event to AppGrid');
      var rententionTimeInSeconds = 6;
      console.log('\t\t Waiting ' + rententionTimeInSeconds + ' second(s) before sending the UsageStop Event.');
      setTimeout(function () {
        _index2.default.events.sendUsageStopEvent(rententionTimeInSeconds, appGridOptions).then(function () {
          console.log('\t\t Successfully sent a UsageStop Event to AppGrid');
          resolve();
        }).catch(function () {
          logError('Oops! There was an error while sending a UsageStop Event to AppGrid!');
          resolve();
        });
      }, rententionTimeInSeconds * 1000);
    });
  };

  return sendUsageStartEvent().then(sendUsageStopEvent).then(function () {
    return logExampleCategoryHeader('End AppGrid Event Examples');
  });
};

var exampleAppGridMetadata = function exampleAppGridMetadata() {
  // TODO: Update the keys used for these examples so that they work once we switch to an example AppGrid profile
  logExampleCategoryHeader('AppGrid Metadata Examples:');

  var getAllMetadata = function getAllMetadata() {
    logExampleHeader('Requesting all metadata from AppGrid');
    return _index2.default.metadata.getAllMetadata(appGridOptions).then(function (metadata) {
      console.log('\t\t Successfully requested all metadata from AppGrid', metadata);
    }).catch(function (error) {
      logError('Oops! There was an error while requesting all metadata from AppGrid!', error);
    });
  };

  var getMetadataByKey = function getMetadataByKey() {
    logExampleHeader('Requesting metadata by key from AppGrid');
    var keyToFetch = 'translations'; // NOTE: The key can be any valid metadata property, including subproperties such as: "someKey.someSubKey" and wildcards, such as: "someKe*"
    return _index2.default.metadata.getMetadataByKey(appGridOptions, keyToFetch).then(function (metadata) {
      console.log('\t\t Successfully requested metadata by key from AppGrid. Key used: ' + _chalk2.default.blue(keyToFetch) + '. \n\t\t Metadata: ', metadata);
    }).catch(function (error) {
      logError('Oops! There was an error while requesting metadata by key from AppGrid!', error);
    });
  };

  var getMetadataByKeys = function getMetadataByKeys() {
    logExampleHeader('Requesting metadata by multiple keys from AppGrid');
    var keysToFetch = ['translations', 'color*'];
    return _index2.default.metadata.getMetadataByKeys(appGridOptions, keysToFetch).then(function (metadata) {
      console.log('\t\t Successfully requested metadata by multiple keys from AppGrid. Keys used: ' + _chalk2.default.blue(keysToFetch.join(', ')) + ' \n\t\t Metadata: ', metadata);
    }).catch(function (error) {
      logError('Oops! There was an error while requesting metadata by multiple keys from AppGrid!', error);
    });
  };

  return getAllMetadata().then(getMetadataByKey).then(getMetadataByKeys).then(function () {
    return logExampleCategoryHeader('End AppGrid Metadata Examples');
  });
};

var exampleAppGridAssets = function exampleAppGridAssets() {
  logExampleCategoryHeader('AppGrid Asset Examples:');

  var getAllAssets = function getAllAssets() {
    logExampleHeader('Requesting all assets from AppGrid');
    return _index2.default.assets.getAllAssets(appGridOptions).then(function (assets) {
      console.log('\t\t Successfully requested all assets from AppGrid', assets);
    }).catch(function (error) {
      logError('Oops! There was an error while requesting all assets from AppGrid!', error);
    });
  };

  var getAssetStreamById = function getAssetStreamById() {
    logExampleHeader('Downloading asset by id from AppGrid');
    var idToDownload = '5566b04e95a0d55dee44bb0001a5109c7b9be597f66ddfd5'; // NOTE: You can get a list of all assets including their IDs by calling the 'getAllAssets' API
    var fileName = downloadsDirectoryName + '/favicon.png';
    return _index2.default.assets.getAssetStreamById(idToDownload, appGridOptions).then(function (assetStream) {
      return new Promise(function (resolve, reject) {
        (0, _fs.existsSync)(downloadsDirectoryName) || (0, _fs.mkdirSync)(downloadsDirectoryName);
        assetStream.pipe((0, _fs.createWriteStream)(fileName)).on('close', resolve).on('error', reject);
      });
    }).then(function () {
      console.log('\t\t Successfully downloaded an asset by id from AppGrid.\n\t\t AssetId used: ' + _chalk2.default.blue(idToDownload) + '.\n\t\t Filename: ' + _chalk2.default.blue(fileName));
    }).catch(function (error) {
      logError('Oops! There was an error while downloading an asset by id from AppGrid!', error);
    });
  };

  return getAllAssets().then(getAssetStreamById).then(function () {
    return logExampleCategoryHeader('End AppGrid Asset Examples');
  });
};

var exampleAppGridContentEntries = function exampleAppGridContentEntries() {
  // TODO: Update the ids used for these examples so that they work once we switch to an example AppGrid profile
  logExampleCategoryHeader('AppGrid ContentEntries Examples:');

  var getAllEntries = function getAllEntries() {
    logExampleHeader('Requesting all ContentEntries from AppGrid');
    var offset = 0; // NOTE: This is the pagination offset used by the AppGrid API. Default is: 0.
    var countOfResults = 50; // NOTE: This is used by the AppGrid API to determine the size of the response. Default is: 30
    return _index2.default.contentEntries.getAllEntries(appGridOptions, offset, countOfResults).then(function (response) {
      var _response$json = response.json;
      var entries = _response$json.entries;
      var pagination = _response$json.pagination;
      // NOTE: For a production usage, additional pagination-handling logic would be required to ensure that all entries are fetched.

      console.log('\t\t Successfully requested all ContentEntries from AppGrid\n\t\t Count of entries recieved: ' + _chalk2.default.blue(entries.length) + ' out of ' + _chalk2.default.blue(pagination.total) + ' total entries.');
    }).catch(function (error) {
      logError('Oops! There was an error while requesting all ContentEntries from AppGrid!', error);
    });
  };

  var getEntryById = function getEntryById() {
    logExampleHeader('Requesting a ContentEntry by id from AppGrid');
    var idToFetch = '56c1de17e4b0b8a18ac01632';
    var isPreview = false; // NOTE: This is an optional parameter. It can be true or false. If set to true the response will return the latest values for this Entry whether it is published or not. Default is false
    var atUtcTime = new Date(); // NOTE: This is an optional parameter. Used to get Entry preview for specific moment of time in past or future. Value is a Date object. Can not be used if "isPreview" is set to true.
    return _index2.default.contentEntries.getEntryById(appGridOptions, idToFetch, isPreview, atUtcTime).then(function (entry) {
      console.log('\t\t Successfully requested a ContentEntry by id from AppGrid. Id used: ' + _chalk2.default.blue(idToFetch) + '. \n\t\t ContentEntry: ', entry);
    }).catch(function (error) {
      logError('Oops! There was an error while requesting a ContentEntry by id from AppGrid!', error);
    });
  };

  var getEntriesByIds = function getEntriesByIds() {
    logExampleHeader('Requesting ContentEntries by multiple ids from AppGrid');
    var idsToFetch = ['56c1de17e4b0b8a18ac01632', '55b8ec42e4b0161a1b30c041'];
    var offset = 0; // NOTE: This is the pagination offset used by the AppGrid API. Default is: 0.
    var countOfResults = 50; // NOTE: This is used by the AppGrid API to determine the size of the response. Default is: 30
    var isPreview = false; // NOTE: This is an optional parameter. It can be true or false. If set to true the response will return the latest values for this Entry whether it is published or not. Default is false
    var atUtcTime = new Date(); // NOTE: This is an optional parameter. Used to get Entry preview for specific moment of time in past or future. Value is a Date object. Can not be used if "isPreview" is set to true.
    return _index2.default.contentEntries.getEntriesByIds(appGridOptions, idsToFetch, offset, countOfResults, isPreview, atUtcTime).then(function (response) {
      var _response$json2 = response.json;
      var entries = _response$json2.entries;
      var pagination = _response$json2.pagination;
      // NOTE: For a production usage, additional pagination-handling logic would be required to ensure that all entries are fetched.

      console.log('\t\t Successfully requested multiple ContentEntries by ids from AppGrid\n\t\t Count of entries recieved: ' + _chalk2.default.blue(entries.length) + ' out of ' + _chalk2.default.blue(pagination.total) + ' total entries.');
    }).catch(function (error) {
      logError('Oops! There was an error while requesting ContentEntries by multiple ids from AppGrid!', error);
    });
  };

  var getEntriesByTypeId = function getEntriesByTypeId() {
    logExampleHeader('Requesting ContentEntries by typeId from AppGrid');
    var typeIdToFetch = '55d6fb35e4b09adc64cd6ad2';
    var offset = 0; // NOTE: This is the pagination offset used by the AppGrid API. Default is: 0.
    var countOfResults = 50; // NOTE: This is used by the AppGrid API to determine the size of the response. Default is: 30
    var isPreview = false; // NOTE: This is an optional parameter. It can be true or false. If set to true the response will return the latest values for this Entry whether it is published or not. Default is false
    var atUtcTime = new Date(); // NOTE: This is an optional parameter. Used to get Entry preview for specific moment of time in past or future. Value is a Date object. Can not be used if "isPreview" is set to true.
    return _index2.default.contentEntries.getEntriesByTypeId(appGridOptions, typeIdToFetch, offset, countOfResults, isPreview, atUtcTime).then(function (response) {
      var _response$json3 = response.json;
      var entries = _response$json3.entries;
      var pagination = _response$json3.pagination;
      // NOTE: For a production usage, additional pagination-handling logic would be required to ensure that all entries are fetched.

      console.log('\t\t Successfully requested ContentEntries by typeId from AppGrid\n\t\t Count of entries recieved: ' + _chalk2.default.blue(entries.length) + ' out of ' + _chalk2.default.blue(pagination.total) + ' total entries.');
    }).catch(function (error) {
      logError('Oops! There was an error while requesting ContentEntries by typeId from AppGrid!', error);
    });
  };

  return getAllEntries().then(getEntryById).then(getEntriesByIds).then(getEntriesByTypeId).then(function () {
    return logExampleCategoryHeader('End AppGrid ContentEntries Examples');
  });
};

var exampleAppGridPlugins = function exampleAppGridPlugins() {
  logExampleCategoryHeader('AppGrid Plugins Examples:');

  var getAllEnabledPlugins = function getAllEnabledPlugins() {
    logExampleHeader('Requesting all enabled plugins from AppGrid');
    return _index2.default.plugins.getAllEnabledPlugins(appGridOptions).then(function (plugins) {
      console.log('\t\t Successfully requested all enabled plugins from AppGrid', plugins);
    }).catch(function (error) {
      logError('Oops! There was an error while requesting all enabled plugins from AppGrid!', error);
    });
  };

  return getAllEnabledPlugins().then(function () {
    return logExampleCategoryHeader('End AppGrid Asset Examples');
  });
};

var exampleAppGridSessions = function exampleAppGridSessions() {
  logExampleCategoryHeader('AppGrid Session Examples:');
  var getAppGridSession = function getAppGridSession() {
    logExampleHeader('Requesting a new Session from AppGrid');
    return _index2.default.session.getSession(appGridOptions).then(function (newSessionId) {
      console.log('\t\t Successfully requested a new Session from AppGrid.\n\t\t   SessionId: ' + _chalk2.default.blue(newSessionId));
      appGridOptions.sessionId = newSessionId; // NOTE: Sessions should be reused as much as possible.
    }).catch(function (error) {
      logError('Oops! There was an error while requesting a new Session from AppGrid!', error);
    });
  };
  var getAppGridStatus = function getAppGridStatus() {
    logExampleHeader('Requesting AppGrid\'s Status');
    return _index2.default.session.getStatus(appGridOptions).then(function (response) {
      console.log('\t\t Successfully requested the status from AppGrid', response);
    }).catch(function (error) {
      logError('Oops! There was an error while requesting the status from AppGrid!', error);
    });
  };
  var validateAppGridSession = function validateAppGridSession() {
    logExampleHeader('Validating an AppGrid Session for the following SessionId: \n\t\t  ' + _chalk2.default.blue(appGridOptions.sessionId));
    return _index2.default.session.validateSession(appGridOptions).then(function (isValid) {
      console.log('\t\t Is this AppGrid Session valid? ' + _chalk2.default.blue(isValid));
    }).catch(function (error) {
      logError('Oops! There was an error while attempting to validate the AppGrid Session!', error);
    });
  };
  var updateAppGridSessionUuid = function updateAppGridSessionUuid() {
    var newUuid = _index2.default.session.generateUuid();
    logExampleHeader('Updating the UUID associated with an AppGrid Session\n\t\t For the following SessionId: ' + _chalk2.default.blue(appGridOptions.sessionId) + ' \n\t\t With the following UUID: ' + _chalk2.default.blue(newUuid));
    appGridOptions.uuid = newUuid;
    return _index2.default.session.updateSessionUuid(appGridOptions).then(function (response) {
      console.log('\t\t Successfully updated the UUID associated with this AppGrid Session', response);
    }).catch(function (error) {
      logError('Oops! There was an error while attempting to update the UUID associated with this AppGrid Session!', error);
    });
  };

  return getAppGridSession().then(getAppGridStatus).then(validateAppGridSession).then(updateAppGridSessionUuid).then(function () {
    logExampleCategoryHeader('End AppGrid Session Examples');
  });
};

var exampleAppGridUserData = function exampleAppGridUserData() {
  logExampleCategoryHeader('AppGrid UserData Examples:');
  var userName = 'exampleUser';
  var dataKeyToRequest = 'name';
  var dataKeyToSet = 'packageName';
  var dataValueToSet = 'platinum';
  var userProfileData = {
    name: 'Johnny AppGridUser',
    email: 'johnny.appgriduser@email.com',
    favoriteVideoIds: ['abc123', '321abc', 'cba321']
  };

  var setApplicationScopeUserData = function setApplicationScopeUserData() {
    logExampleHeader('Setting Application-Scope User Data on AppGrid');
    return _index2.default.userData.setApplicationScopeUserData(appGridOptions, userName, userProfileData) // WARNING: This will either create (if not already existing) or *overwrite* any existing data!
    .then(function (data) {
      console.log('\t\t Successfully set Application-Scope User Data on AppGrid.\n\t\t Username used: ' + _chalk2.default.blue(userName) + '. \n\t\t User data sent: ', userProfileData);
    }).catch(function (error) {
      logError('Oops! There was an error while setting Application-Scope User Data on AppGrid!', error);
    });
  };

  var setApplicationScopeUserDataByKey = function setApplicationScopeUserDataByKey() {
    logExampleHeader('Setting Application-Scope User Data by key on AppGrid');
    return _index2.default.userData.setApplicationScopeUserDataByKey(appGridOptions, userName, dataKeyToSet, dataValueToSet).then(function (data) {
      console.log('\t\t Successfully set Application-Scope User Data by key on AppGrid.\n\t\t Username used: ' + _chalk2.default.blue(userName) + '.\n\t\t Key used: ' + _chalk2.default.blue(dataKeyToSet) + ' \n\t\t Value sent: ' + _chalk2.default.blue(dataValueToSet));
    }).catch(function (error) {
      logError('Oops! There was an error while setting Application-Scope User Data by key on AppGrid!', error);
    });
  };

  // TODO JASON: Continue with the remaining set calls here

  var getAllApplicationScopeDataByUser = function getAllApplicationScopeDataByUser() {
    logExampleHeader('Requesting All Application-Scope Data by user from AppGrid');
    return _index2.default.userData.getAllApplicationScopeDataByUser(appGridOptions, userName).then(function (data) {
      console.log('\t\t Successfully requested all Application-Scope Data by user from AppGrid.\n\t\t Username used: ' + _chalk2.default.blue(userName) + '. \n\t\t Data: ', data);
    }).catch(function (error) {
      logError('Oops! There was an error while requesting all Application-Scope Data by user from AppGrid!', error);
    });
  };

  var getApplicationScopeDataByUserAndKey = function getApplicationScopeDataByUserAndKey() {
    logExampleHeader('Requesting Application-Scope Data by user and key from AppGrid');
    return _index2.default.userData.getApplicationScopeDataByUserAndKey(appGridOptions, userName, dataKeyToRequest).then(function (data) {
      console.log('\t\t Successfully requested Application-Scope Data by user and key from AppGrid.\n\t\t Username used: ' + _chalk2.default.blue(userName) + '.\n\t\t Data key used: ' + _chalk2.default.blue(dataKeyToRequest) + '. \n\t\t Data: ', data);
    }).catch(function (error) {
      logError('Oops! There was an error while requesting Application-Scope Data by user and key from AppGrid!', error);
    });
  };

  var getAllApplicationGroupScopeDataByUser = function getAllApplicationGroupScopeDataByUser() {
    logExampleHeader('Requesting All ApplicationGroup-Scope Data by user from AppGrid');
    return _index2.default.userData.getAllApplicationGroupScopeDataByUser(appGridOptions, userName).then(function (data) {
      console.log('\t\t Successfully requested all ApplicationGroup-Scope Data by user from AppGrid.\n\t\t Username used: ' + _chalk2.default.blue(userName) + '. \n\t\t Data: ', data);
    }).catch(function (error) {
      logError('Oops! There was an error while requesting all ApplicationGroup-Scope Data by user from AppGrid!', error);
    });
  };

  var getApplicationGroupScopeDataByUserAndKey = function getApplicationGroupScopeDataByUserAndKey() {
    logExampleHeader('Requesting ApplicationGroup-Scope Data by user and key from AppGrid');
    return _index2.default.userData.getApplicationGroupScopeDataByUserAndKey(appGridOptions, userName, dataKeyToRequest).then(function (data) {
      console.log('\t\t Successfully requested ApplicationGroup-Scope Data by user and key from AppGrid.\n\t\t Username used: ' + _chalk2.default.blue(userName) + '.\n\t\t Data key used: ' + _chalk2.default.blue(dataKeyToRequest) + '. \n\t\t Data: ', data);
    }).catch(function (error) {
      logError('Oops! There was an error while requesting ApplicationGroup-Scope Data by user and key from AppGrid!', error);
    });
  };

  return setApplicationScopeUserData().then(setApplicationScopeUserDataByKey).then(getAllApplicationScopeDataByUser).then(getApplicationScopeDataByUserAndKey).then(getAllApplicationGroupScopeDataByUser).then(getApplicationGroupScopeDataByUserAndKey).then(function () {
    return logExampleCategoryHeader('End AppGrid UserData Examples');
  });
};

var outputLogo = function outputLogo() {
  console.log();
  console.log();
  console.log(_chalk2.default.bgBlack.yellow('********************************************************************************'));
  console.log();
  console.log();
  console.log(_chalk2.default.bgBlack.yellow('    MMMMMMMMMMMMMMMMMMMMMMNNNhhyysyyyyyyyyyyyshhdNNNMMMMMMMMMMMMMMMMMMMMMM '));
  console.log(_chalk2.default.bgBlack.yellow('    MMMMMMMMMMMMMMMMMMNdhyysoooooooooooooooooooooosyyddNMMMMMMMMMMMMMMMMMM '));
  console.log(_chalk2.default.bgBlack.yellow('    MMMMMMMMMMMMMMMmmhysoooooooooooooooooooooooooooooosyhNNMMMMMMMMMMMMMMM '));
  console.log(_chalk2.default.bgBlack.yellow('    MMMMMMMMMMMMNmysoooooooooooooooooooooooooooooooooooooosymNMMMMMMMMMMMM '));
  console.log(_chalk2.default.bgBlack.yellow('    MMMMMMMMMMNhyooooooooooooooooooooooooooooooooooooooooooooyhNMMMMMMMMMM '));
  console.log(_chalk2.default.bgBlack.yellow('    MMMMMMMMNhsooooooooooooooooooooooooooooooooooooooooooooooooyhNMMMMMMMM '));
  console.log(_chalk2.default.bgBlack.yellow('    MMMMMMNhsooooooooooooooooooooooooooooooooooooooooooooooooooo+shNMMMMMM '));
  console.log(_chalk2.default.bgBlack.yellow('    MMMMMmyooooooooooooooooooooooooooooooooooooooooooooooooooooooooydMMMMM '));
  console.log(_chalk2.default.bgBlack.yellow('    MMMMsyoooooooooooooooooo+++oooooooooooooooo+++ooooooooooooooooooyyMMMM '));
  console.log(_chalk2.default.bgBlack.yellow('    MMMdyooooooooooooooo/-`     `-/oooooooo/-`     `-/oooooooooooooooyhMMM '));
  console.log(_chalk2.default.bgBlack.yellow('    MMhhoooooooooooooo+.           .+oooo+.           .+ooooooooooooooydMM '));
  console.log(_chalk2.default.bgBlack.yellow('    Mdhoooooooooooooo+`             `+oo+`             `+oooooooooooooohdM '));
  console.log(_chalk2.default.bgBlack.yellow('    Ndooooooooooooooo:               :oo:               /oooooooooooooooym '));
  console.log(_chalk2.default.bgBlack.yellow('    dyooooooooooooooo/               /oo:               /ooooooooooooooosm '));
  console.log(_chalk2.default.bgBlack.yellow('    hooooooooooooooooo.             .ooo/`             .oooooooooooooooood '));
  console.log(_chalk2.default.bgBlack.yellow('    doooooooooooooooooo:`         `:oo+.             `:ooooooooooooooooood '));
  console.log(_chalk2.default.bgBlack.yellow('    d+oooooooooooooooooo+/-.```.-/+o/.    `-/-.```.-/+oooooooooooooooooo+d '));
  console.log(_chalk2.default.bgBlack.yellow('    d+oooooooooooooooooooooooooooo/.    `:+oooooooooooooooooooooooossooo+d '));
  console.log(_chalk2.default.bgBlack.yellow('    d+oooooooooooooooooo+/-.```.-.    `:+oo+/-.```.-/+oooooooosssyyyyyoo+d '));
  console.log(_chalk2.default.bgBlack.yellow('    doooooooooooooooooo:`           `-+oo+:`         `:ooossyyys+:..sysood '));
  console.log(_chalk2.default.bgBlack.yellow('    hooooooooooooooooo.             .ooo+.         `.:+syyso/-`     -sysoy '));
  console.log(_chalk2.default.bgBlack.yellow('    myooooooooooooooo/               /oo:      .-/osyso/-`     .+o-  :syyd '));
  console.log(_chalk2.default.bgBlack.yellow('    myooooooooooooooo:               :oo: `-/osyyyyo.`    -/+` `oys.  /yyh '));
  console.log(_chalk2.default.bgBlack.yellow('    Mdhoooooooooooooo+`             `oosssyys+/-`/yy:     .syo` .sys`  /yy '));
  console.log(_chalk2.default.bgBlack.yellow('    MMdyoooooooooooooo+.        `.:+syyso/-`      +ys-     -yy+  .syo`.:sy '));
  console.log(_chalk2.default.bgBlack.yellow('    MMMhyooooooooooooooo/-. `-/osyysyy+`     /o+  `oys.     :yy/ `+yysyyyy '));
  console.log(_chalk2.default.bgBlack.yellow('    MMMMyyooooooooooooooossyyys+/-``+yy-     :sy/  `syo`    `oyysyyyshhdmN '));
  console.log(_chalk2.default.bgBlack.yellow('    MMMMMdyooooooooooosyyso/-`   `  `oys.     /so.  .syo.:+syyyssssydNNMMM '));
  console.log(_chalk2.default.bgBlack.yellow('    MMMMMMNysooooooooosyy-     `os+  .sys.     `   `-oyyyyyssooo+smNMMMMMM '));
  console.log(_chalk2.default.bgBlack.yellow('    MMMMMMMMNhyoooooooosys.     :yy/  .syo`     :+syyyssoooooooshdMMMMMMMM '));
  console.log(_chalk2.default.bgBlack.yellow('    MMMMMMMMMMNhyooooooosys`     /ys:  -sy+`    .syysooooooooshNMMMMMMMMMM '));
  console.log(_chalk2.default.bgBlack.yellow('    MMMMMMMMMMMMNmyooooooyyo      +ys:-+syy/`-/+syyysoooooyhmNMMMMMMMMMMMM '));
  console.log(_chalk2.default.bgBlack.yellow('    MMMMMMMMMMMMMMMNNyssooyy/   `-+yyyyyssyyyyyssooooossydNMMMMMMMMMMMMMMM '));
  console.log(_chalk2.default.bgBlack.yellow('    MMMMMMMMMMMMMMMMMMNmdyyyy++syyysssoooosssooooosyydmNMMMMMMMMMMMMMMMMMM '));
  console.log(_chalk2.default.bgBlack.yellow('    MMMMMMMMMMMMMMMMMMMMMNdyyyysyhyyyyyyyyyyhyyddddNMMMMMMMMMMMMMMMMMMMMMM '));
  console.log();
  console.log(_chalk2.default.bgBlack.yellow('       $$$$$$\\                       $$$$$$\\            $$\\       $$\\ '));
  console.log(_chalk2.default.bgBlack.yellow('      $$  __$$\\                     $$  __$$\\           \\__|      $$ | '));
  console.log(_chalk2.default.bgBlack.yellow('      $$ /  $$ | $$$$$$\\   $$$$$$\\  $$ /  \\__| $$$$$$\\  $$\\  $$$$$$$ | '));
  console.log(_chalk2.default.bgBlack.yellow('      $$$$$$$$ |$$  __$$\\ $$  __$$\\ $$ |$$$$\\ $$  __$$\\ $$ |$$  __$$ | '));
  console.log(_chalk2.default.bgBlack.yellow('      $$  __$$ |$$ /  $$ |$$ /  $$ |$$ |\\_$$ |$$ |  \\__|$$ |$$ /  $$ | '));
  console.log(_chalk2.default.bgBlack.yellow('      $$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |      $$ |$$ |  $$ | '));
  console.log(_chalk2.default.bgBlack.yellow('      $$ |  $$ |$$$$$$$  |$$$$$$$  |\\$$$$$$  |$$ |      $$ |\\$$$$$$$ | '));
  console.log(_chalk2.default.bgBlack.yellow('      \\__|  \\__|$$  ____/ $$  ____/  \\______/ \\__|      \\__| \\_______| '));
  console.log(_chalk2.default.bgBlack.yellow('                $$ |      $$ | '));
  console.log(_chalk2.default.bgBlack.yellow('                $$ |      $$ | '));
  console.log(_chalk2.default.bgBlack.yellow('                \\__|      \\__| '));
  console.log();
  console.log(_chalk2.default.bgBlack.yellow('********************************************************************************'));
  console.log();
  console.log();
};

var runAllExamples = function runAllExamples() {
  outputLogo();
  exampleAppGridSessions()
  /* // TODO JASON: Uncomment this block!
  .then(exampleAppGridLogging)
  .then(exampleAppGridEvents)
  .then(exampleAppGridMetadata)
  .then(exampleAppGridAssets)
  .then(exampleAppGridContentEntries)
  .then(exampleAppGridPlugins)
  */
  .then(exampleAppGridUserData).catch(function (error) {
    logError('Oops! There was an unhandled error during one of the examples!', error);
  }).then(function () {
    console.log();
    console.log(_chalk2.default.bgBlack.yellow('********************************************************************************'));
    console.log(_chalk2.default.bgBlack.yellow('\t\t\tDONE WITH ALL EXAMPLES'));
    console.log(_chalk2.default.bgBlack.yellow('********************************************************************************'));
  });
};
runAllExamples();

// TODO: Finish implementing and commenting this example file!
