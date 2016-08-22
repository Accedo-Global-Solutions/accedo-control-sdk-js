# getCurrentTimeOfDayDimValue

Returns the range of the current hour of the day, as a string such as '01-05' for 1am to 5 am

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** a range of hours

# generateUuid

Generate a UUID for a device/appKey tuple when you do not have one already

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** a new UUID

# factory

Create an instance of an AppGrid client.
You must get an instance before accessing any of the exposed client APIs.

**Parameters**

-   `config` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the config for this client

Returns **[client](#client)** an AppGrid client tied to the given params

# client

## getLogLevel

Get the current log level

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the log level (string)

## sendLog

Send a log with the given level, details and extra metadata
details should include { message, facilityCode, errorCode, dim1, dim2, dim3, dim4 }

**Parameters**

-   `level` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the log level
-   `details` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the information about the log
-   `metadata` **\[[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)]** an array of extra metadata (will go through JSON.stringify)

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the success of the operation

## getSessionKey

Returns the currently stored sessionKey for this client instance

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the sessionKey, if any

## createSession

Create a session and store it for reuse in this client instance

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of a string, the sessionKey

## getEntries

Get all the content entries, based on the given parameters.
params should contain any/several of { id, alias, preview, at, typeId, offset, size }
do not use id, alias or typeId at the same time - behaviour would be ungaranteed

**Parameters**

-   `params` **\[[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** a parameters object

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of an array of entries (objects)

## getEntryById

Get one content entry by id, based on the given parameters.
params should contain any/several of { preview, at }

**Parameters**

-   `id` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the entry id
-   `params` **\[[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** a parameters object

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of an entry (object)

## getEntryByAlias

Get one content entry, based on the given parameters.
params should contain any/several of { preview, at }
do not use id, alias or typeId at the same time - behaviour would be ungaranteed

**Parameters**

-   `alias` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the entry alias
-   `params` **\[[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** a parameters object

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of an entry (object)

## getApplicationStatus

Get the current application status

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the application status (string)

## getAllAssets

Lists all the assets.

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of a hash of assets (key: asset name, value: asset URL)

## getAssetStreamById

Get a stream for one asset by id

**Parameters**

-   `id` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the asset id

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of a node stream

## sendUsageStartEvent

Send a usage START event

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise denoting the success of the operation

## sendUsageStopEvent

Send a usage QUIT event

**Parameters**

-   `retentionTimeInSeconds` **\[([number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) \| [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String))]** the retention time, in seconds

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise denoting the success of the operation

## getAllEnabledPlugins

Get all the enabled plugins

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data

## getProfileInfo

Get the profile information

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data

## getAllMetadata

Get all the metadata

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data

## getMetadataByKey

Get the metadata by a specific key

**Parameters**

-   `key` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** a key to get specific metadata

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data

## getMetadataByKeys

Get the metadata by specific keys

**Parameters**

-   `keys` **[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** an array of keys (strings)

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data

## getAllApplicationScopeDataByUser

Get all the application-scope data for a given user

**Parameters**

-   `userName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** an appgrid user

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data

## getAllApplicationGroupScopeDataByUser

Get all the application-group-scope data for a given user

**Parameters**

-   `userName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** an appgrid user

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data

## getApplicationScopeDataByUserAndKey

Get all the application-scope data for a given user and data key

**Parameters**

-   `userName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** an appgrid user
-   `key` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** a key to specify what data to obtain

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data

## getApplicationGroupScopeDataByUserAndKey

Get all the application-group-scope data for a given user

**Parameters**

-   `userName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** an appgrid user
-   `key` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** a key to specify what data to obtain

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data

## setApplicationScopeUserData

Set the application-scope data for a given user

**Parameters**

-   `userName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** an appgrid user
-   `data` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the data to store

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data

## setApplicationGroupScopeUserData

Set the application-group-scope data for a given user

**Parameters**

-   `userName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** an appgrid user
-   `data` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the data to store

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data

## setApplicationScopeUserDataByKey

Set the application-scope data for a given user

**Parameters**

-   `userName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** an appgrid user
-   `key` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** a key to specify what data to obtain
-   `data` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the data to store

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data

## setApplicationGroupScopeUserDataByKey

Set the application-group-scope data for a given user

**Parameters**

-   `userName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** an appgrid user
-   `key` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** a key to specify what data to obtain
-   `data` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the data to store

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise of the requested data
