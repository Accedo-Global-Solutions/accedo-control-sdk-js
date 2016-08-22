# Default export

This is the default export for this library

# factory

Factory function to create an instance of an AppGrid client.
You must get an instance before accessing any of the exposed client APIs.

**Parameters**

-   `config` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the configuration for the new instance
    -   `config.appKey` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the application Key
    -   `config.uuid` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** a unique identifier (one will be generated if not provided)
    -   `config.sessionKey` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** the sessionKey (note a new one may be created when needed)
    -   `config.log` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** a function to use to see this SDK's logs

**Examples**

```javascript
import factory from 'appgrid';

// when all info is available - use all of it !
const client = factory({ appKey: 'MY_APP_KEY', uuid: 'USERS_UUID', sessionKey: 'SOME_SESSION_KEY' });

// when there is no known sessionKey yet
const client2 = factory({ appKey: 'MY_APP_KEY', uuid: 'USERS_UUID' });

// when there is no known sessionKey or uuid yet
const client3 = factory({ appKey: 'MY_APP_KEY' });
```

Returns **client** an AppGrid client tied to the given params

# Named exports

Those methods are named exports, require/import them, then use them directly

# generateUuid

Globally available (use `import { generateUuid } from 'appgrid'`)
Generate a UUID.
Use this for a device/appKey tuple when you do not have a sessionKey already.

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** a new UUID

# getCurrentTimeOfDayDimValue

Globally available (use `import { getCurrentTimeOfDayDimValue } from 'appgrid'`)
Returns the range of the current hour of the day, as a string such as '01-05' for 1am to 5 am.
Useful for AppGrid log events.

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** a range of hours

# Instance methods

To use those methods, call them on an instance of a client.
All API calls will make use of the existing parameters on the instance (uuid, etc)

# getLogLevel

Get the current log level

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the log level (string)

# sendLog

Send a log with the given level, details and extra metadata.

**Parameters**

-   `level` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the log level
-   `details` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the log information
    -   `details.message` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the log message
    -   `details.facilityCode` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the facility code
    -   `details.errorCode` **errorCode** the error code
    -   `details.dim1` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the dimension 1 information
    -   `details.dim2` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the dimension 2 information
    -   `details.dim3` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the dimension 3 information
    -   `details.dim4` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the dimension 4 information
-   `metadata` **\[[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)]** an array of extra metadata (will go through JSON.stringify)

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the success of the operation

# getSessionKey

Returns the currently stored sessionKey for this client instance

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the sessionKey, if any

# createSession

Create a session and store it for reuse in this client instance

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of a string, the sessionKey

# getEntries

Get all the content entries, based on the given parameters.
**DO NOT** use several of id, alias and typeId at the same time - behaviour would be ungaranteed.

**Parameters**

-   `params` **\[[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** a parameters object
    -   `params.preview` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** when true, get the preview version
    -   `params.at` **\[([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date))]** when given, get the version at the given time
    -   `params.id` **\[[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)]** an array of entry ids (strings)
    -   `params.alias` **\[[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)]** an array of entry aliases (strings)
    -   `params.typeId` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** only return entries matching this type id
    -   `params.size` **\[([number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) \| [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String))]** limit to that many results per page (limits as per AppGrid API, currently 1 to 50, default 20)
    -   `params.offset` **\[([number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) \| [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String))]** offset the result by that many pages

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of an array of entries (objects)

# getEntryById

Get one content entry by id, based on the given parameters.

**Parameters**

-   `id` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the entry id
-   `params` **\[[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** a parameters object
    -   `params.preview` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** when true, get the preview version
    -   `params.at` **\[([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date))]** when given, get the version at the given time

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of an entry (object)

# getEntryByAlias

Get one content entry, based on the given parameters.

**Parameters**

-   `alias` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the entry alias
-   `params` **\[[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** a parameters object
    -   `params.preview` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** when true, get the preview version
    -   `params.at` **\[([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date))]** when given, get the version at the given time

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of an entry (object)

# getApplicationStatus

Get the current application status

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the application status (string)

# getAllAssets

Lists all the assets.

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of a hash of assets (key: asset name, value: asset URL)

# getAssetStreamById

Get a stream for one asset by id

**Parameters**

-   `id` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the asset id

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of a node stream

# sendUsageStartEvent

Send a usage START event

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise denoting the success of the operation

# sendUsageStopEvent

Send a usage QUIT event

**Parameters**

-   `retentionTimeInSeconds` **\[([number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) \| [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String))]** the retention time, in seconds

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise denoting the success of the operation

# getAllEnabledPlugins

Get all the enabled plugins

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data

# getProfileInfo

Get the profile information

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data

# getAllMetadata

Get all the metadata

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data

# getMetadataByKey

Get the metadata by a specific key

**Parameters**

-   `key` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** a key to get specific metadata

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data

# getMetadataByKeys

Get the metadata by specific keys

**Parameters**

-   `keys` **[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** an array of keys (strings)

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data

# getAllApplicationScopeDataByUser

Get all the application-scope data for a given user

**Parameters**

-   `userName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** an appgrid user

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data

# getAllApplicationGroupScopeDataByUser

Get all the application-group-scope data for a given user

**Parameters**

-   `userName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** an appgrid user

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data

# getApplicationScopeDataByUserAndKey

Get all the application-scope data for a given user and data key

**Parameters**

-   `userName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** an appgrid user
-   `key` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** a key to specify what data to obtain

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data

# getApplicationGroupScopeDataByUserAndKey

Get all the application-group-scope data for a given user

**Parameters**

-   `userName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** an appgrid user
-   `key` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** a key to specify what data to obtain

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data

# setApplicationScopeUserData

Set the application-scope data for a given user

**Parameters**

-   `userName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** an appgrid user
-   `data` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the data to store

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data

# setApplicationGroupScopeUserData

Set the application-group-scope data for a given user

**Parameters**

-   `userName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** an appgrid user
-   `data` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the data to store

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data

# setApplicationScopeUserDataByKey

Set the application-scope data for a given user

**Parameters**

-   `userName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** an appgrid user
-   `key` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** a key to specify what data to obtain
-   `data` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the data to store

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data

# setApplicationGroupScopeUserDataByKey

Set the application-group-scope data for a given user

**Parameters**

-   `userName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** an appgrid user
-   `key` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** a key to specify what data to obtain
-   `data` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the data to store

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data
