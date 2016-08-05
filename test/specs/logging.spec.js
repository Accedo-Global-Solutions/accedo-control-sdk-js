/* eslint-disable no-unused-expressions */

import chai from 'chai';
import AppGrid from '../../src/index';

import appGridOptions from '../appGridOptions';

chai.should();

const logFunctionLevels = [ // NOTE: This is needed since 'off' is not a valid log function
  'debug',
  'info',
  'warn',
  'error'
];

const logLevels = [
  ...logFunctionLevels,
  'off'
];

const okStatus = 200;
const logFacilityCode = 13;
const getLogEventOptions = (message, facilityCode) => { // NOTE: This is simply a convenience/helper method for building a logEvent object.
  const networkErrorCode = '002';
  const middlewareSourceCode = 'service-mw';
  const noneViewName = '';
  const deviceType = 'desktop';
  return {
    message,
    errorCode: networkErrorCode,
    facilityCode,
    dim1: middlewareSourceCode,
    dim2: noneViewName,
    dim3: deviceType,
    dim4: AppGrid.logUtils.getCurrentTimeOfDayDimValue()
  };
};

describe('Logging API Tests', () => {
  it('The API should exist and contain the expected functions', () => {
    AppGrid.logUtils.should.be.an('object');
    AppGrid.logger.should.be.an('object');
    AppGrid.logUtils.getLogLevel.should.be.a('function');
    logFunctionLevels
      .forEach((logLevel) => {
        AppGrid.logger[logLevel].should.be.a('function');
      });
  });

  it('"getLogLevel" should return a valid log-level from AppGrid', (done) => {
    AppGrid.logUtils.getLogLevel(appGridOptions)
      .then((logLevelResponse) => {
        logLevels.should.include(logLevelResponse);
        done();
      });
  });

  it('"logger[level]" should successfully send a log-message to AppGrid for each log-level', (done) => {
    const promises = logFunctionLevels
      .map((logLevel) => {
        const exampleInfoEventOptions = getLogEventOptions(`This is a ${logLevel} entry!`, logFacilityCode);
        return AppGrid.logger[logLevel](appGridOptions, exampleInfoEventOptions)
          .then((response) => {
            if (!response && logLevel === 'debug') { return; } // NOTE: for some reason: debug results in an undefined response from AppGrid
            response.status.should.equal(okStatus);
          });
      });
    Promise.all(promises).then(() => done());
  });

  it('"logger[level]" should successfully send a log-message with Metadata to AppGrid for each log-level', (done) => {
    const promises = logFunctionLevels
      .map((logLevel) => {
        const exampleInfoEventOptions = getLogEventOptions(`This is a ${logLevel} entry with Metadata!`, logFacilityCode);
        const exampleMetadata = { someMetadataKey: 'someValue' };
        return AppGrid.logger[logLevel](appGridOptions, exampleInfoEventOptions, exampleMetadata)
          .then((response) => {
            if (!response && logLevel === 'debug') { return; } // NOTE: for some reason: debug results in an undefined response from AppGrid
            response.status.should.equal(okStatus);
          });
      });
    Promise.all(promises).then(() => done());
  });
});
