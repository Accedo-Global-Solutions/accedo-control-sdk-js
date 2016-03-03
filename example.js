'use strict';

var _index = require('./dist/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// NOTE: this would normally be:  from 'appgrid';

console.dir(_index2.default); // TODO JASON: Kill this line

/* eslint-disable no-console */

var appGridOptions = { // TODO JASON: Finish updating these values
  // NOTE: The following properties are required
  serviceUrl: 'http://InsertTheCorrectAppGridUrlHere',
  appId: 'INSERT-THE-CORRECT-APPID-HERE',

  // NOTE: The following properties are optional
  logLevel: 'info', // This will default to: 'info' if not provided
  deviceType: 'desktop' // This will default to: 'desktop' if not provided
};

var exampleAppGridLogging = function exampleAppGridLogging() {
  var getLogEventOptions = function getLogEventOptions(message, facilityCode) {
    // NOTE: This is simply a convenience/helper method for building a logEvent object.
    var networkErrorCode = '002'; // NOTE: The ErrorCode used must exist within your AppGrid Application's configuration.
    var middlewareSourceCode = 'service-mw'; // NOTE: The SourceCode used must exist within your AppGrid Application's configuration.
    var noneViewName = ''; // NOTE: The ViewName used must exist within your AppGrid Application's configuration.
    return {
      message: message,
      errorCode: networkErrorCode,
      facilityCode: facilityCode, // NOTE: The FacilityCode used must exist within you AppGrid Application's configuration
      source: middlewareSourceCode,
      view: noneViewName
    };
  };
  var logFacilityCode = 13;
  var exampleInfoEventOptions = getLogEventOptions('This is an info log entry!', logFacilityCode);
  _index2.default.logger.info(exampleInfoEventOptions, appGridOptions);
  var exampleInfoEventOptionsWithMetadata = getLogEventOptions('This is an info log entry with Metadata!', logFacilityCode);
  var exampleInfoMetadata = { someMetadataKey: 'someValue' };
  _index2.default.logger.info(exampleInfoEventOptionsWithMetadata, exampleInfoMetadata);
  // TODO JASON: Continue adding more examples for logging
};
exampleAppGridLogging();

// TODO: Finish implementing and commenting this example file!
