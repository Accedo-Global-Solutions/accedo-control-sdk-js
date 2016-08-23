import chai from 'chai';
import factory from '../../src/index';
import { getCurrentTimeOfDayDimValue } from '../../src/stamps/appLog';

chai.should();

const okStatus = 200;
const logFacilityCode = 13;

// NOTE: This is simply a convenience/helper method for building a logEvent object.
const getLogEventOptions = (message, facilityCode) => {
  const networkErrorCode = '002';
  const middlewareSourceCode = 'service-mw';
  const noneViewName = 'sdk_unit_test';
  const deviceType = 'desktop';
  return {
    message,
    errorCode: networkErrorCode,
    facilityCode,
    dim1: middlewareSourceCode,
    dim2: noneViewName,
    dim3: deviceType,
    dim4: getCurrentTimeOfDayDimValue()
  };
};

describe('Logging API Tests', () => {
  const client = factory({
    appKey: '56ea6a370db1bf032c9df5cb',
    deviceId: 'gregTestingSDK',
  });

  it('getLogLevel should yield a string', () => {
    return client.getLogLevel()
      .then((logLevel) => {
        logLevel.should.be.a('string');
      });
  });

  it('sendLog should successfully send a log-message to AppGrid for each log-level', () => {
    const promises = ['debug', 'info', 'warn', 'error']
      .map((level) => {
        const exampleInfoEventOptions = getLogEventOptions(`This is a ${level} entry!`, logFacilityCode);
        return client.sendLog(level, exampleInfoEventOptions)
          .then((response) => {
            // NOTE: for some reason: debug results in an undefined response from AppGrid
            if (!response && level === 'debug') { return; }
            response.status.should.equal(okStatus);
          });
      });
    return Promise.all(promises);
  });

  it('sendLog should successfully send a log-message with Metadata to AppGrid for each log-level', () => {
    const promises = ['debug', 'info', 'warn', 'error']
      .map((level) => {
        const exampleInfoEventOptions = getLogEventOptions(`This is a ${level} entry with Metadata!`, logFacilityCode);
        const exampleMetadata = { someMetadataKey: 'someValue' };
        return client.sendLog(level, exampleInfoEventOptions, exampleMetadata)
          .then((response) => {
            // NOTE: for some reason: debug results in an undefined response from AppGrid
            if (!response && level === 'debug') { return; }
            response.status.should.equal(okStatus);
          });
      });
    return Promise.all(promises);
  });
});
