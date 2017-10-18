/* eslint-disable no-console, import/no-unresolved, import/no-extraneous-dependencies */

const chalk = require('chalk');
// NOTE: this would normally be: import appgrid from 'appgrid';
const appgrid = require('./src/node/index');

const logError = (message, ...metadata) => {
  console.error(chalk.bgBlack.red.bold(`${message}`), ...metadata);
};

const client = appgrid({
  appKey: '56ea6a370db1bf032c9df5cb',
  // typically you wouldn't set the deviceId here, but let the default persistency strategy get it for you (with Express or a browser)
  deviceId: 'fixedDeviceIDFromSDKSample',
  // log(...args) { console.log(...args); },
});

const logExampleCategoryHeader = message => {
  console.log();
  console.log(
    chalk.bgBlack.yellow('*************************************************')
  );
  console.log(chalk.bgBlack.yellow(`*   ${message}`));
  console.log(
    chalk.bgBlack.yellow('*************************************************')
  );
};

const logExampleHeader = message => {
  console.log();
  console.log(`${chalk.yellow('Example:')} ${message}`);
};

// Function used for the 4th dimension of app logs that was preset for the application ID we use in this example
const nightOrDay = () => {
  const hour = new Date().getHours();
  // NOTE: These strings are expected by Accedo One
  switch (true) {
    case hour < 5 || hour > 17:
      return 'night';
    default:
      return 'day';
  }
};

const exampleLogging = () => {
  const getLogEventOptions = message => {
    // NOTE: This is simply a convenience/helper method for building a logEvent object.
    const networkErrorCode = '13002'; // NOTE: The ErrorCode used must exist within your Accedo One Application's configuration.
    const middlewareSourceCode = 'service-mw'; // NOTE: The SourceCode used must exist within your Accedo One Application's configuration.
    const noneViewName = 'sdk_unit_test'; // NOTE: The ViewName used must exist within your Accedo One Application's configuration.
    const deviceType = 'desktop'; // NOTE: The deviceType used must exist within your Accedo One Application's configuration.
    return {
      message,
      errorCode: networkErrorCode,
      dim1: middlewareSourceCode,
      dim2: noneViewName,
      dim3: deviceType,
      dim4: nightOrDay(),
    };
  };
  logExampleCategoryHeader('Logging Examples');

  const getLogLevel = () => {
    logExampleHeader('Requesting the current LogLevel from Accedo One');
    return client
      .getLogLevel()
      .then(logLevelResponse => {
        console.log(
          `Successfully got the current LogLevel from Accedo One: ${chalk.blue(
            logLevelResponse
          )}`
        );
      })
      .catch(error => {
        logError(
          'Oops! There was an error while requesting the current LogLevel from Accedo One!',
          error
        );
      });
  };

  const sendInfoLogMessageWithMetadata = () => {
    logExampleHeader('Sending an info log message with Metadata to Accedo One');
    const exampleInfoEventOptionsWithMetadata = getLogEventOptions(
      'This is an info log entry with Metadata!'
    );
    const exampleInfoMetadata = { someMetadataKey: 'someValue' };
    return client
      .sendLog('info', exampleInfoEventOptionsWithMetadata, exampleInfoMetadata)
      .then(() => {
        console.log(
          'Successfully sent an info log with Metadata to Accedo One'
        );
      })
      .catch(error => {
        logError(
          'Oops! There was an error while sending an info log with Metadata to Accedo One!',
          error
        );
      });
  };

  const sendBatchedLogMessages = () => {
    logExampleHeader('Sending two batched info log messages to Accedo One');
    const logs = [
      Object.assign(
        { timestamp: Date.now() - 1000, logType: 'warn' },
        getLogEventOptions(
          'This is a warning, the first of two batched log entries!'
        )
      ),
      Object.assign(
        { timestamp: Date.now(), logType: 'info' },
        getLogEventOptions(
          'This is an info, the second of two batched log entries!'
        )
      ),
    ];
    return client
      .sendLogs(logs)
      .then(() => {
        console.log('Successfully sent batched logs to Accedo One');
      })
      .catch(error => {
        logError(
          'Oops! There was an error while sending batched logs to Accedo One!',
          error
        );
      });
  };

  return getLogLevel()
    .then(sendInfoLogMessageWithMetadata)
    .then(sendBatchedLogMessages)
    .then(() => logExampleCategoryHeader('End Logging Examples'));
};

const exampleEvents = () => {
  logExampleCategoryHeader('Event Examples:');

  const sendUsageStartEvent = () => {
    logExampleHeader('Sending a UsageStart Event to Accedo One');
    return client
      .sendUsageStartEvent()
      .then(() => {
        console.log('Successfully sent a UsageStart Event to Accedo One');
      })
      .catch(error => {
        logError(
          'Oops! There was an error while sending a UsageStart event to Accedo One!',
          error
        );
      });
  };

  const sendUsageStopEvent = () => {
    return new Promise(resolve => {
      logExampleHeader('Sending a UsageStop Event to Accedo One');
      const rententionTimeInSeconds = 6;
      console.log(
        `Waiting ${rententionTimeInSeconds} second(s) before sending the UsageStop Event.`
      );
      setTimeout(() => {
        client
          .sendUsageStopEvent(rententionTimeInSeconds)
          .then(() => {
            console.log('Successfully sent a UsageStop Event to Accedo One');
            resolve();
          })
          .catch(() => {
            logError(
              'Oops! There was an error while sending a UsageStop Event to Accedo One!'
            );
            resolve();
          });
      }, rententionTimeInSeconds * 1000);
    });
  };

  return sendUsageStartEvent()
    .then(sendUsageStopEvent)
    .then(() => logExampleCategoryHeader('End Event Examples'));
};

const exampleMetadata = () => {
  logExampleCategoryHeader('Metadata Examples:');

  const getAllMetadata = () => {
    logExampleHeader('Requesting all metadata from Accedo One');
    return client
      .getAllMetadata()
      .then(metadata => {
        console.log(
          'Successfully requested all metadata from Accedo One',
          metadata
        );
      })
      .catch(error => {
        logError(
          'Oops! There was an error while requesting all metadata from Accedo One!',
          error
        );
      });
  };

  const getMetadataByKey = () => {
    logExampleHeader('Requesting metadata by key from Accedo One');
    const keyToFetch = 'android'; // NOTE: The key can be any valid metadata property, including subproperties such as: "someKey.someSubKey" and wildcards, such as: "someKe*"
    return client
      .getMetadataByKey(keyToFetch)
      .then(metadata => {
        console.log(
          `Successfully requested metadata by key from Accedo One. Key used: ${chalk.blue(
            keyToFetch
          )}. \nMetadata: `,
          metadata
        );
      })
      .catch(error => {
        logError(
          'Oops! There was an error while requesting metadata by key from Accedo One!',
          error
        );
      });
  };

  const getMetadataByKeys = () => {
    logExampleHeader('Requesting metadata by multiple keys from Accedo One');
    const keysToFetch = ['android', 'color*'];
    return client
      .getMetadataByKeys(keysToFetch)
      .then(metadata => {
        console.log(
          `Successfully requested metadata by multiple keys from Accedo One. Keys used: ${chalk.blue(
            keysToFetch.join(', ')
          )} \nMetadata: `,
          metadata
        );
      })
      .catch(error => {
        logError(
          'Oops! There was an error while requesting metadata by multiple keys from Accedo One!',
          error
        );
      });
  };

  return getAllMetadata()
    .then(getMetadataByKey)
    .then(getMetadataByKeys)
    .then(() => logExampleCategoryHeader('End Metadata Examples'));
};

const exampleAssets = () => {
  logExampleCategoryHeader('Asset Examples:');

  const getAllAssets = () => {
    logExampleHeader('Requesting all assets from Accedo One');
    return client
      .getAllAssets()
      .then(assets => {
        console.log(
          'Successfully requested all assets from Accedo One',
          assets
        );
      })
      .catch(error => {
        logError(
          'Oops! There was an error while requesting all assets from Accedo One!',
          error
        );
      });
  };

  return getAllAssets().then(() =>
    logExampleCategoryHeader('End Asset Examples')
  );
};

const exampleContentEntries = () => {
  logExampleCategoryHeader('ContentEntries Examples:');

  const getEntryById = () => {
    logExampleHeader('Requesting a ContentEntry by id from Accedo One');
    const idToFetch = '56ea7bd6935f75032a2fd431';
    const isPreview = false; // NOTE: This is an optional parameter. It can be true or false. If set to true the response will return the latest values for this Entry whether it is published or not. Default is false
    const atUtcTime = new Date(); // NOTE: This is an optional parameter. Used to get Entry preview for specific moment of time in past or future. Value is a Date object. Can not be used if "isPreview" is set to true.
    return client
      .getEntryById(idToFetch, { isPreview, atUtcTime })
      .then(entry => {
        console.log(
          `Successfully requested a ContentEntry by id from Accedo One. Id used: ${chalk.blue(
            idToFetch
          )}. \nContentEntry: `,
          entry
        );
      })
      .catch(error => {
        logError(
          'Oops! There was an error while requesting a ContentEntry by id from Accedo One!',
          error
        );
      });
  };

  const getEntries = () => {
    logExampleHeader('Requesting all ContentEntries from Accedo One');
    const offset = 0; // NOTE: This is the pagination offset used by the Accedo One API. Default is: 0.
    const size = 50; // NOTE: This is used by the Accedo One API to determine the size of the response. Default is: 30
    return client
      .getEntries({ offset, size })
      .then(response => {
        const { entries, pagination } = response;
        // NOTE: For a production usage, additional pagination-handling logic would be required to ensure that all entries are fetched.
        console.log(
          `Successfully requested all ContentEntries from Accedo One\nCount of entries recieved: ${chalk.blue(
            entries.length
          )} out of ${chalk.blue(pagination.total)} total entries.`
        );
      })
      .catch(error => {
        logError(
          'Oops! There was an error while requesting all ContentEntries from Accedo One!',
          error
        );
      });
  };

  const getEntriesByIds = () => {
    logExampleHeader(
      'Requesting ContentEntries by multiple ids from Accedo One'
    );
    const params = {
      id: ['56ea7bd6935f75032a2fd431', '56ea7c55935f75032a2fd437'],
      size: 50,
      at: new Date(),
    };
    return client
      .getEntries(params)
      .then(response => {
        const { entries, pagination } = response;
        // NOTE: For a production usage, additional pagination-handling logic would be required to ensure that all entries are fetched.
        console.log(
          `Successfully requested multiple ContentEntries by ids from Accedo One\nCount of entries recieved: ${chalk.blue(
            entries.length
          )} out of ${chalk.blue(pagination.total)} total entries.`
        );
      })
      .catch(error => {
        logError(
          'Oops! There was an error while requesting ContentEntries by multiple ids from Accedo One!',
          error
        );
      });
  };

  const getEntriesByTypeId = () => {
    logExampleHeader('Requesting ContentEntries by typeId from Accedo One');
    const params = {
      size: 50,
      typeId: ['56ea7bca935f75032a2fd42c'],
      at: new Date(),
    };
    return client
      .getEntries(params)
      .then(response => {
        const { entries, pagination } = response;
        // NOTE: For a production usage, additional pagination-handling logic would be required to ensure that all entries are fetched.
        console.log(
          `Successfully requested ContentEntries by typeId from Accedo One\nCount of entries recieved: ${chalk.blue(
            entries.length
          )} out of ${chalk.blue(pagination.total)} total entries.`
        );
      })
      .catch(error => {
        logError(
          'Oops! There was an error while requesting ContentEntries by typeId from Accedo One!',
          error
        );
      });
  };

  return getEntryById()
    .then(getEntries)
    .then(getEntriesByIds)
    .then(getEntriesByTypeId)
    .then(() => logExampleCategoryHeader('End ContentEntries Examples'));
};

const examplePlugins = () => {
  logExampleCategoryHeader('Plugins Examples:');

  const getAllEnabledPlugins = () => {
    logExampleHeader('Requesting all enabled plugins from Accedo One');
    return client
      .getAllEnabledPlugins()
      .then(plugins => {
        console.log(
          'Successfully requested all enabled plugins from Accedo One',
          plugins
        );
      })
      .catch(error => {
        logError(
          'Oops! There was an error while requesting all enabled plugins from Accedo One!',
          error
        );
      });
  };

  return getAllEnabledPlugins().then(() =>
    logExampleCategoryHeader('End Plugin Examples')
  );
};

const exampleLocales = () => {
  logExampleCategoryHeader('Locales Examples:');

  const getLocales = () => {
    logExampleHeader('Requesting all available locales from Accedo One');
    return client
      .getAvailableLocales()
      .then(locales => {
        console.log(
          'Successfully requested all available locales from Accedo One',
          locales
        );
      })
      .catch(error => {
        logError(
          'Oops! There was an error while requesting all available locales from Accedo One!',
          error
        );
      });
  };

  return getLocales().then(() =>
    logExampleCategoryHeader('End Locales Examples')
  );
};

const exampleSessions = () => {
  logExampleCategoryHeader('Session Examples:');
  const getAccedoOneSession = () => {
    logExampleHeader('Requesting a new Session from Accedo One');
    return client
      .createSession()
      .then(newSessionId => {
        console.log(
          `Successfully requested a new Session from Accedo One.\n SessionId: ${chalk.blue(
            newSessionId
          )}`
        );
      })
      .catch(error => {
        logError(
          'Oops! There was an error while requesting a new Session from Accedo One!',
          error
        );
      });
  };

  return getAccedoOneSession().then(() => {
    logExampleCategoryHeader('End Session Examples');
  });
};

const exampleApplication = () => {
  logExampleCategoryHeader('Application Examples:');
  const getAccedoOneStatus = () => {
    logExampleHeader('Requesting the Application Status');
    return client
      .getApplicationStatus()
      .then(response => {
        console.log(
          'Successfully requested the status from Accedo One',
          response
        );
      })
      .catch(error => {
        logError(
          'Oops! There was an error while requesting the status from Accedo One!',
          error
        );
      });
  };

  return getAccedoOneStatus().then(() => {
    logExampleCategoryHeader('End Application Examples');
  });
};

const exampleUserData = () => {
  logExampleCategoryHeader('UserData Examples:');
  const userName = 'exampleUser';
  const dataKeyToRequest = 'name';
  const dataKeyToSet = 'packageName';
  const dataValueToSet = 'platinum';
  const userProfileData = {
    name: 'Johnny AppGridUser',
    email: 'johnny.appgriduser@email.com',
    favoriteVideoIds: ['abc123', '321abc', 'cba321'],
  };

  const setApplicationScopeUserData = () => {
    logExampleHeader('Setting Application-Scope User Data on Accedo One');
    return client
      .setApplicationScopeUserData(userName, userProfileData) // WARNING: This will either create (if not already existing) or *overwrite* any existing data!
      .then(() => {
        console.log(
          `Successfully set Application-Scope User Data on Accedo One.\nUsername used: ${chalk.blue(
            userName
          )}. \nUser data sent: `,
          userProfileData
        );
      })
      .catch(error => {
        logError(
          'Oops! There was an error while setting Application-Scope User Data on Accedo One!',
          error
        );
      });
  };

  const setApplicationGroupScopeUserData = () => {
    logExampleHeader('Setting ApplicationGroup-Scope User Data on Accedo One');
    return client
      .setApplicationGroupScopeUserData(userName, userProfileData) // WARNING: This will either create (if not already existing) or *overwrite* any existing data!
      .then(() => {
        console.log(
          `Successfully set ApplicationGroup-Scope User Data on Accedo One.\nUsername used: ${chalk.blue(
            userName
          )}. \nUser data sent: `,
          userProfileData
        );
      })
      .catch(error => {
        logError(
          'Oops! There was an error while setting ApplicationGroup-Scope User Data on Accedo One!',
          error
        );
      });
  };

  const setApplicationScopeUserDataByKey = () => {
    logExampleHeader(
      'Setting Application-Scope User Data by key on Accedo One'
    );
    return client
      .setApplicationScopeUserDataByKey(userName, dataKeyToSet, dataValueToSet)
      .then(() => {
        console.log(
          `Successfully set Application-Scope User Data by key on Accedo One.\nUsername used: ${chalk.blue(
            userName
          )}.\nKey used: ${chalk.blue(dataKeyToSet)} \nValue sent: ${chalk.blue(
            dataValueToSet
          )}`
        );
      })
      .catch(error => {
        logError(
          'Oops! There was an error while setting Application-Scope User Data by key on Accedo One!',
          error
        );
      });
  };

  const setApplicationGroupScopeUserDataByKey = () => {
    logExampleHeader(
      'Setting ApplicationGroup-Scope User Data by key on Accedo One'
    );
    return client
      .setApplicationGroupScopeUserDataByKey(
        userName,
        dataKeyToSet,
        dataValueToSet
      )
      .then(() => {
        console.log(
          `Successfully set ApplicationGroup-Scope User Data by key on Accedo One.\nUsername used: ${chalk.blue(
            userName
          )}.\nKey used: ${chalk.blue(dataKeyToSet)} \nValue sent: ${chalk.blue(
            dataValueToSet
          )}`
        );
      })
      .catch(error => {
        logError(
          'Oops! There was an error while setting ApplicationGroup-Scope User Data by key on Accedo One!',
          error
        );
      });
  };

  const getAllApplicationScopeDataByUser = () => {
    logExampleHeader(
      'Requesting All Application-Scope Data by user from Accedo One'
    );
    return client
      .getAllApplicationScopeDataByUser(userName)
      .then(data => {
        console.log(
          `Successfully requested all Application-Scope Data by user from Accedo One.\nUsername used: ${chalk.blue(
            userName
          )}. \nData: `,
          data
        );
      })
      .catch(error => {
        logError(
          'Oops! There was an error while requesting all Application-Scope Data by user from Accedo One!',
          error
        );
      });
  };

  const getAllApplicationGroupScopeDataByUser = () => {
    logExampleHeader(
      'Requesting All ApplicationGroup-Scope Data by user from Accedo One'
    );
    return client
      .getAllApplicationGroupScopeDataByUser(userName)
      .then(data => {
        console.log(
          `Successfully requested all ApplicationGroup-Scope Data by user from Accedo One.\nUsername used: ${chalk.blue(
            userName
          )}. \nData: `,
          data
        );
      })
      .catch(error => {
        logError(
          'Oops! There was an error while requesting all ApplicationGroup-Scope Data by user from Accedo One!',
          error
        );
      });
  };

  const getApplicationScopeDataByUserAndKey = () => {
    logExampleHeader(
      'Requesting Application-Scope Data by user and key from Accedo One'
    );
    return client
      .getApplicationScopeDataByUserAndKey(userName, dataKeyToRequest)
      .then(data => {
        console.log(
          `Successfully requested Application-Scope Data by user and key from Accedo One.\nUsername used: ${chalk.blue(
            userName
          )}.\nData key used: ${chalk.blue(dataKeyToRequest)}. \nData: `,
          data
        );
      })
      .catch(error => {
        logError(
          'Oops! There was an error while requesting Application-Scope Data by user and key from Accedo One!',
          error
        );
      });
  };

  const getApplicationGroupScopeDataByUserAndKey = () => {
    logExampleHeader(
      'Requesting ApplicationGroup-Scope Data by user and key from Accedo One'
    );
    return client
      .getApplicationGroupScopeDataByUserAndKey(userName, dataKeyToRequest)
      .then(data => {
        console.log(
          `Successfully requested ApplicationGroup-Scope Data by user and key from Accedo One.\nUsername used: ${chalk.blue(
            userName
          )}.\nData key used: ${chalk.blue(dataKeyToRequest)}. \nData: `,
          data
        );
      })
      .catch(error => {
        logError(
          'Oops! There was an error while requesting ApplicationGroup-Scope Data by user and key from Accedo One!',
          error
        );
      });
  };

  return setApplicationScopeUserData()
    .then(setApplicationGroupScopeUserData)
    .then(setApplicationScopeUserDataByKey)
    .then(setApplicationGroupScopeUserDataByKey)
    .then(getAllApplicationScopeDataByUser)
    .then(getAllApplicationGroupScopeDataByUser)
    .then(getApplicationScopeDataByUserAndKey)
    .then(getApplicationGroupScopeDataByUserAndKey)
    .then(() => logExampleCategoryHeader('End UserData Examples'));
};

const outputLogo = () => {
  console.log(
    chalk.bgBlack.yellow(`
   _                    _           ___
  /_\\   ___ ___ ___  __| | ___     /___\\_ __   ___
 //_\\\\ / __/ __/ _ \\/ _\` |/ _ \\   //  // '_ \\ / _ \\
/  _  \\ (_| (_|  __/ (_| | (_) | / \\_//| | | |  __/
\\_/ \\_/\\___\\___\\___|\\__,_|\\___/  \\___/ |_| |_|\\___|

`)
  );
};

const runAllExamples = () => {
  outputLogo();
  exampleSessions()
    .then(exampleApplication)
    .then(exampleLogging)
    .then(exampleEvents)
    .then(exampleMetadata)
    .then(exampleAssets)
    .then(exampleContentEntries)
    .then(exampleLocales)
    .then(examplePlugins)
    .then(exampleUserData)
    .catch(error => {
      logError(
        'Oops! There was an unhandled error during one of the examples!',
        error
      );
    })
    .then(() => {
      console.log();
      console.log(
        chalk.bgBlack.yellow(
          '********************************************************************************'
        )
      );
      console.log(chalk.bgBlack.yellow('DONE WITH ALL EXAMPLES'));
      console.log(
        chalk.bgBlack.yellow(
          '********************************************************************************'
        )
      );
    });
};
runAllExamples();
