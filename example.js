'use strict';

var _index = require('./dist/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// NOTE: this would normally be:  from 'appgrid';

console.dir(_index2.default); // TODO JASON: Kill this line

/* eslint-disable no-console */

var debugLogger = function debugLogger(message) {
  var _console;

  for (var _len = arguments.length, metadata = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    metadata[_key - 1] = arguments[_key];
  }

  (_console = console).log.apply(_console, ['AppGrid DEBUG: ' + message + ' '].concat(metadata));
};

var appGridOptions = { // TODO JASON: Finish updating these values
  // NOTE: The following properties are required
  serviceUrl: 'http://InsertTheCorrectAppGridUrlHere',
  appId: 'INSERT-THE-CORRECT-APPID-HERE',

  // NOTE: The following properties are optional
  logLevel: 'info', // This will default to: 'info' if not provided
  debugLogger: debugLogger // NOTE: This is for capturing any debug messages from the AppGrid library
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
  var sendExampleInfoEventWithMetadata = function sendExampleInfoEventWithMetadata() {
    var exampleInfoEventOptionsWithMetadata = getLogEventOptions('This is an info log entry with Metadata!', logFacilityCode);
    var exampleInfoMetadata = { someMetadataKey: 'someValue' };
    return _index2.default.logger.info(exampleInfoEventOptionsWithMetadata, exampleInfoMetadata);
  };

  var exampleInfoEventOptions = getLogEventOptions('This is an info log entry!', logFacilityCode);
  _index2.default.logger.info(exampleInfoEventOptions, appGridOptions).then(function () {
    console.log('Successfully sent an info log to AppGrid');
    sendExampleInfoEventWithMetadata().then(function () {
      console.log('Successfully sent an info log with Metadata to AppGrid');
    }).catch(function () {
      console.error('Oops! There was an error while sending an info log with Metadata to AppGrid!');
    });
  }).catch(function (error) {
    console.error('Oops! There was an error while sending an info log to AppGrid!');
    console.dir(error);
  });
  // TODO JASON: Continue adding more examples for logging
};
exampleAppGridLogging();

// TODO: Finish implementing and commenting this example file!
