/* eslint-disable no-console */

import AppGrid from './dist/index'; // NOTE: this would normally be:  from 'appgrid';

console.dir(AppGrid); // TODO JASON: Kill this line

const appGridOptions = { // TODO JASON: Finish updating these values
  // NOTE: The following properties are required
  serviceUrl: 'http://InsertTheCorrectAppGridUrlHere',
  appId: 'INSERT-THE-CORRECT-APPID-HERE',

  // NOTE: The following properties are optional
  logLevel: 'info', // This will default to: 'info' if not provided
  deviceType: 'desktop' // This will default to: 'desktop' if not provided
};

const exampleAppGridLogging = () => {
  const getLogEventOptions = (message, facilityCode) => { // NOTE: This is simply a convenience/helper method for building a logEvent object.
    const networkErrorCode = '002'; // NOTE: The ErrorCode used must exist within your AppGrid Application's configuration.
    const middlewareSourceCode = 'service-mw'; // NOTE: The SourceCode used must exist within your AppGrid Application's configuration.
    const noneViewName = ''; // NOTE: The ViewName used must exist within your AppGrid Application's configuration.
    return {
      message,
      errorCode: networkErrorCode,
      facilityCode, // NOTE: The FacilityCode used must exist within you AppGrid Application's configuration
      source: middlewareSourceCode,
      view: noneViewName
    };
  };
  const logFacilityCode = 13;
  const exampleInfoEventOptions = getLogEventOptions('This is an info log entry!', logFacilityCode);
  AppGrid.logger.info(exampleInfoEventOptions, appGridOptions);
  const exampleInfoEventOptionsWithMetadata = getLogEventOptions('This is an info log entry with Metadata!', logFacilityCode);
  const exampleInfoMetadata = { someMetadataKey: 'someValue' };
  AppGrid.logger.info(exampleInfoEventOptionsWithMetadata, exampleInfoMetadata);
  // TODO JASON: Continue adding more examples for logging
};
exampleAppGridLogging();


// TODO: Finish implementing and commenting this example file!
