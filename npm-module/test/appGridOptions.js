// NOTE: Refer to the ../example-es6.js file for more details around the appGridOptions object and its properties.

import AppGrid from '../dist/index.js';

/* // NOTE: Uncomment this block, and the 'debugLogger' line inside of the appGridOptions, below in order to show debug logs in the console.
 const debugLogger = (message, ...metadata) => {
   console.log(`\t\tAppGrid DEBUG: ${message} `, ...metadata);
 };
 */

const testUuid = AppGrid.session.generateUuid();

const appGridOptions = {
  appGridUrl: 'https://appgrid-api.cloud.accedo.tv',
  appId: '560e505de4b0150cbb576df5', // TODO: CRITICAL: MAKE SURE TO UPDATE THIS TO THE PROPER EXAMPLE APPID!!!!!!!1! (Currently this is the VIA-Go dev AppId)
  uuid: testUuid
  // debugLogger // NOTE: This is for capturing any debug messages from the AppGrid library. If not defined, a no-op will be used instead.
};

export default appGridOptions;
