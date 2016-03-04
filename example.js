'use strict';

var _index = require('./dist/index');

var _index2 = _interopRequireDefault(_index);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */

console.dir(_index2.default); // TODO JASON: Kill this line

// NOTE: this would normally be: import AppGrid from 'appgrid';
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

var logExampleHeader = function logExampleHeader(message) {
  console.log();
  console.log(_chalk2.default.bgBlack.yellow('\t*************************************************'));
  console.log(_chalk2.default.bgBlack.yellow('\t*   \t' + message));
  console.log(_chalk2.default.bgBlack.yellow('\t*************************************************'));
  console.log();
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
  logExampleHeader('AppGrid Logging Examples');

  return _index2.default.logger.info(exampleInfoEventOptions, appGridOptions).then(function () {
    console.log('Successfully sent an info log to AppGrid');
    return sendExampleInfoEventWithMetadata().then(function () {
      console.log('\t\t Successfully sent an info log with Metadata to AppGrid');
    }).catch(function () {
      logError('Oops! There was an error while sending an info log with Metadata to AppGrid!');
    });
  }).catch(function (error) {
    logError('Oops! There was an error while sending an info log to AppGrid!', error);
  }).then(function () {
    return logExampleHeader('End AppGrid Logging Examples');
  });
};

var exampleAppGridEvents = function exampleAppGridEvents() {
  logExampleHeader('AppGrid Event Examples:');
  return _index2.default.events.sendUsageStartEvent(appGridOptions).then(function () {
    return new Promise(function (resolve) {
      console.log('Successfully sent a UsageStart Event to AppGrid');
      var rententionTimeInSeconds = 6;
      console.log('Waiting ' + rententionTimeInSeconds + ' second(s) before sending UsageStop Event.');
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
  }).catch(function (error) {
    logError('Oops! There was an error while sending a UsageStart event to AppGrid!', error);
  }).then(function () {
    logExampleHeader('End AppGrid Event Examples:');
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
  console.log(_chalk2.default.bgBlack.yellow('   $$$$$$\\                       $$$$$$\\            $$\\       $$\\ '));
  console.log(_chalk2.default.bgBlack.yellow('  $$  __$$\\                     $$  __$$\\           \\__|      $$ | '));
  console.log(_chalk2.default.bgBlack.yellow('  $$ /  $$ | $$$$$$\\   $$$$$$\\  $$ /  \\__| $$$$$$\\  $$\\  $$$$$$$ | '));
  console.log(_chalk2.default.bgBlack.yellow('  $$$$$$$$ |$$  __$$\\ $$  __$$\\ $$ |$$$$\\ $$  __$$\\ $$ |$$  __$$ | '));
  console.log(_chalk2.default.bgBlack.yellow('  $$  __$$ |$$ /  $$ |$$ /  $$ |$$ |\\_$$ |$$ |  \\__|$$ |$$ /  $$ | '));
  console.log(_chalk2.default.bgBlack.yellow('  $$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |      $$ |$$ |  $$ | '));
  console.log(_chalk2.default.bgBlack.yellow('  $$ |  $$ |$$$$$$$  |$$$$$$$  |\\$$$$$$  |$$ |      $$ |\\$$$$$$$ | '));
  console.log(_chalk2.default.bgBlack.yellow('  \\__|  \\__|$$  ____/ $$  ____/  \\______/ \\__|      \\__| \\_______| '));
  console.log(_chalk2.default.bgBlack.yellow('            $$ |      $$ | '));
  console.log(_chalk2.default.bgBlack.yellow('            $$ |      $$ | '));
  console.log(_chalk2.default.bgBlack.yellow('            \\__|      \\__| '));
  console.log();
  console.log(_chalk2.default.bgBlack.yellow('********************************************************************************'));
  console.log();
  console.log();
};

var runAllExamples = function runAllExamples() {
  outputLogo();
  exampleAppGridLogging().then(exampleAppGridEvents);
};
runAllExamples();

// TODO: Finish implementing and commenting this example file!
