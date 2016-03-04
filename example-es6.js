/* eslint-disable no-console */

import AppGrid from './dist/index'; // NOTE: this would normally be:  from 'appgrid';

console.dir(AppGrid); // TODO JASON: Kill this line

const debugLogger = (message, ...metadata) => {
  console.log(`AppGrid DEBUG: ${message} `, ...metadata);
};

const appGridOptions = { // TODO JASON: Finish updating these values
  // NOTE: The following properties are required
  serviceUrl: 'http://InsertTheCorrectAppGridUrlHere',
  appId: 'INSERT-THE-CORRECT-APPID-HERE',

  // NOTE: The following properties are optional
  logLevel: 'info', // This will default to: 'info' if not provided
  debugLogger // NOTE: This is for capturing any debug messages from the AppGrid library
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
  const sendExampleInfoEventWithMetadata = () => {
    const exampleInfoEventOptionsWithMetadata = getLogEventOptions('This is an info log entry with Metadata!', logFacilityCode);
    const exampleInfoMetadata = { someMetadataKey: 'someValue' };
    return AppGrid.logger.info(exampleInfoEventOptionsWithMetadata, exampleInfoMetadata);
  };

  const exampleInfoEventOptions = getLogEventOptions('This is an info log entry!', logFacilityCode);
  AppGrid.logger.info(exampleInfoEventOptions, appGridOptions)
    .then(() => {
      console.log('Successfully sent an info log to AppGrid');
      sendExampleInfoEventWithMetadata()
        .then(() => {
          console.log('Successfully sent an info log with Metadata to AppGrid');
        })
        .catch(() => {
          console.error('Oops! There was an error while sending an info log with Metadata to AppGrid!');
        });
    })
    .catch((error) => {
      console.error('Oops! There was an error while sending an info log to AppGrid!');
      console.dir(error);
    });
  // TODO JASON: Continue adding more examples for logging
};
exampleAppGridLogging();


// TODO: Finish implementing and commenting this example file!
