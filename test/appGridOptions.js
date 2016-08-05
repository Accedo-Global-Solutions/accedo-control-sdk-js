// NOTE: Refer to the ../example-es6.js file for more details around the appGridOptions object and its properties.

import AppGrid from '../src/index';

/* // NOTE: Uncomment this block, and the 'debugLogger' line inside of the appGridOptions, below in order to show debug logs in the console.
 const debugLogger = (message, ...metadata) => {
   console.log(`\t\tAppGrid DEBUG: ${message} `, ...metadata);
 };
 */

const testUuid = AppGrid.session.generateUuid();

const appGridOptions = {
  appGridUrl: 'https://appgrid-api.cloud.accedo.tv',
  appId: '56ea6a370db1bf032c9df5cb',
  uuid: testUuid
  // debugLogger // NOTE: This is for capturing any debug messages from the AppGrid library. If not defined, a no-op will be used instead.
};

export default appGridOptions;
