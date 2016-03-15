/* eslint-disable no-unused-expressions */

import chai from 'chai';
import AppGrid from '../../dist/index.js';

import appGridOptions from '../appGridOptions';

chai.should();

const logLevels = [
  'debug',
  'info',
  'warn',
  'error',
  'off'
];

describe('Logging API Tests', () => {
  it('The API should exist and contain the expected functions', () => {
    AppGrid.logUtils.should.be.an('object');
    AppGrid.logger.should.be.an('object');
    AppGrid.logUtils.getLogLevel.should.be.a('function');
    logLevels
      .filter((logLevel) => logLevel !== 'off')
      .forEach((logLevel) => {
        AppGrid.logger[logLevel].should.be.a('function');
      });
    });

  it('"getLogLevel" should return a valid log-level from AppGrid', (done) => {
    AppGrid.events.sendUsageStartEvent(appGridOptions)
      .then((logLevelResponse) => {
        logLevels.should.contain(logLevelResponse);
        done();
      });
  });
  // TODO JASON: Finish implementing logger unit tests here
});

/*

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
};*/
