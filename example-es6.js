/* eslint-disable no-console */

import AppGrid from './dist/index'; // NOTE: this would normally be: import AppGrid from 'appgrid';
import chalk from 'chalk';

console.dir(AppGrid); // TODO JASON: Kill this line

const debugLogger = (message, ...metadata) => {
  console.log(chalk.bgBlack.white(`\t\tAppGrid DEBUG: ${message} `), ...metadata);
};

const logError = (message, ...metadata) => {
  console.error(chalk.bgBlack.red.bold(`\t\t ${message}`), ...metadata);
};

const exampleUuid = AppGrid.session.generateUuid();

const appGridOptions = { // TODO JASON: Finish updating these values
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
  debugLogger // NOTE: This is for capturing any debug messages from the AppGrid library. If not defined, a no-op will be used instead.
};

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
      dim4: AppGrid.logUtils.getCurrentTimeOfDayDimValue()
    };
  };
  const logFacilityCode = 13;
  logExampleCategoryHeader('AppGrid Logging Examples');

  const getLogLevel = () => {
    logExampleHeader('Requesting the current LogLevel from AppGrid');
    return AppGrid.logUtils.getLogLevel(appGridOptions)
      .then((logLevelResponse) => {
        console.log(`\t\t Successfully got the current LogLevel from AppGrid: ${chalk.blue(logLevelResponse)}`);
        appGridOptions.logLevel = logLevelResponse;
      })
      .catch((error) => {
        logError('Oops! There was an error while requesting the current LogLevel from AppGrid!', error);
      });
  };

  const sendInfoLogMessage = () => {
    logExampleHeader('Sending an info log message to AppGrid');
    const exampleInfoEventOptions = getLogEventOptions('This is an info log entry!', logFacilityCode);
    return AppGrid.logger.info(exampleInfoEventOptions, appGridOptions)
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
    return AppGrid.logger.info(exampleInfoEventOptionsWithMetadata, appGridOptions, exampleInfoMetadata)
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
    return AppGrid.events.sendUsageStartEvent(appGridOptions)
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
        AppGrid.events.sendUsageStopEvent(rententionTimeInSeconds, appGridOptions)
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
    return AppGrid.metadata.getAllMetadata(appGridOptions)
      .then((metadata) => {
        console.log('\t\t Successfully requested all metadata from AppGrid', metadata);
      })
      .catch((error) => {
        logError('Oops! There was an error while requesting all metadata AppGrid!', error);
      });
  };

  return getAllMetadata()
    .then(() => logExampleCategoryHeader('End AppGrid Metadata Examples'));
};

const exampleAppGridSessions = () => {
  logExampleCategoryHeader('AppGrid Session Examples:');
  const getAppGridSession = () => {
    logExampleHeader('Requesting a new Session from AppGrid');
    return AppGrid.session.getSession(appGridOptions)
      .then((newSessionId) => {
        console.log(`\t\t Successfully requested a new Session from AppGrid.\n\t\t   SessionId: ${chalk.blue(newSessionId)}`);
        appGridOptions.sessionId = newSessionId; // NOTE: Sessions should be reused as much as possible.
      })
      .catch((error) => {
        logError('Oops! There was an error while requesting a new Session from AppGrid!', error);
      });
  };
  const getAppGridStatus = () => {
    logExampleHeader('Requesting AppGrid\'s Status');
    return AppGrid.session.getStatus(appGridOptions)
      .then((response) => {
        console.log('\t\t Successfully requested the status from AppGrid', response);
      })
      .catch((error) => {
        logError('Oops! There was an error while requesting the status from AppGrid!', error);
      });
  };
  const validateAppGridSession = () => {
    logExampleHeader(`Validating an AppGrid Session for the following SessionId: \n\t\t  ${chalk.blue(appGridOptions.sessionId)}`);
    return AppGrid.session.validateSession(appGridOptions)
      .then((isValid) => {
        console.log(`\t\t Is this AppGrid Session valid? ${chalk.blue(isValid)}`);
      })
      .catch((error) => {
        logError('Oops! There was an error while attempting to validate the AppGrid Session!', error);
      });
  };
  const updateAppGridSessionUuid = () => {
    const newUuid = AppGrid.session.generateUuid();
    logExampleHeader(`Updating the UUID associated with an AppGrid Session\n\t\t For the following SessionId: ${chalk.blue(appGridOptions.sessionId)} \n\t\t With the following UUID: ${chalk.blue(newUuid)}`);
    appGridOptions.uuid = newUuid;
    return AppGrid.session.updateSessionUuid(appGridOptions)
      .then((response) => {
        console.log('\t\t Successfully updated the UUID associated with this AppGrid Session', response);
      })
      .catch((error) => {
        logError('Oops! There was an error while attempting to update the UUID associated with this AppGrid Session!', error);
      });
  };

  return getAppGridSession()
    .then(getAppGridStatus)
    .then(validateAppGridSession)
    .then(updateAppGridSessionUuid)
    .then(() => {
      logExampleCategoryHeader('End AppGrid Session Examples');
    });
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
  console.log(chalk.bgBlack.yellow('   $$$$$$\\                       $$$$$$\\            $$\\       $$\\ '));
  console.log(chalk.bgBlack.yellow('  $$  __$$\\                     $$  __$$\\           \\__|      $$ | '));
  console.log(chalk.bgBlack.yellow('  $$ /  $$ | $$$$$$\\   $$$$$$\\  $$ /  \\__| $$$$$$\\  $$\\  $$$$$$$ | '));
  console.log(chalk.bgBlack.yellow('  $$$$$$$$ |$$  __$$\\ $$  __$$\\ $$ |$$$$\\ $$  __$$\\ $$ |$$  __$$ | '));
  console.log(chalk.bgBlack.yellow('  $$  __$$ |$$ /  $$ |$$ /  $$ |$$ |\\_$$ |$$ |  \\__|$$ |$$ /  $$ | '));
  console.log(chalk.bgBlack.yellow('  $$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |      $$ |$$ |  $$ | '));
  console.log(chalk.bgBlack.yellow('  $$ |  $$ |$$$$$$$  |$$$$$$$  |\\$$$$$$  |$$ |      $$ |\\$$$$$$$ | '));
  console.log(chalk.bgBlack.yellow('  \\__|  \\__|$$  ____/ $$  ____/  \\______/ \\__|      \\__| \\_______| '));
  console.log(chalk.bgBlack.yellow('            $$ |      $$ | '));
  console.log(chalk.bgBlack.yellow('            $$ |      $$ | '));
  console.log(chalk.bgBlack.yellow('            \\__|      \\__| '));
  console.log();
  console.log(chalk.bgBlack.yellow('********************************************************************************'));
  console.log();
  console.log();
};

const runAllExamples = () => {
  outputLogo();
  exampleAppGridSessions()
    .then(exampleAppGridLogging)
    .then(exampleAppGridEvents)
    .then(exampleAppGridMetadata)
    .then(() => {
      console.log();
      console.log(chalk.bgBlack.yellow('********************************************************************************'));
      console.log(chalk.bgBlack.yellow('\t\t\tDONE WITH ALL EXAMPLES'));
      console.log(chalk.bgBlack.yellow('********************************************************************************'));
    });
};
runAllExamples();

// TODO: Finish implementing and commenting this example file!
