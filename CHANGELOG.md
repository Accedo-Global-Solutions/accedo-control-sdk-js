# TODO

- MAJOR: remove the deprecated static method getCurrentTimeOfDayDimValue
- MAJOR: provide the ES6 package as the default, and the ES5 one as a legacy package at appgrid/legacy
- MINOR: basic robot detection with a default deviceId for them all ?

# 2.3.0

- MINOR: getEntries can now take a typeAlias parameter
- MINOR: getEntries's typeId parameter can now be an array of strings (previously, only a string)
- MINOR: Added the new method to add Application Logs in batch (sendLogs)
- MINOR: have extra configuration params given go through the middleware so they are used in the factory (log, gid, etc)
- MINOR: by default, the middleware will now pass the gid from each request parameter (if found in the `gid` querystring) to the factory
- PATCH: The sendLog method was not sending log dimensions properly.
- PATCH: The sendLog method's metadata param can be anything (not only an array as documented).
- PATCH: Changed the AppGrid REST API link to its new location
- PATCH: doc: installing this SDK should usually be done with --save, not --save-dev
- PATCH: the static method getCurrentTimeOfDayDimValue was deprecated, will be removed in version 3
- PATCH: updated non-breaking dependencies

# 2.2.1

- PATCH: Replaced the old link to AppGrid's help section with the new one for the knowledge base

# 2.2.0

- MINOR: Added ip optional param on AppGrid client instantiation
- MINOR: Express middleware: automatically pass on the IP for each client it creates
- MINOR: ensure only one new session may be created at a time, in case of many calls happening before the first finishes
- PATCH: Replaced object spread by Object.assign so that we do not need any transpilation for the ES6 bundle
- PATCH: The ES6 bundle was transpiled to ES5 (except for import/export), not any more

# 2.1.0

- MINOR: Added a middleware for Express to handle the session and deviceId propagation on server requests/responses
- PATCH: Added the npm chip to the README
- PATCH: Now checking against the HTTP response status (401) to recreate a session. Fixes a bug as the JSON response for this seems to have changed slightly.

# 2.0.0

- MAJOR: big overhaul, all APIs changed, the first step is to go through client creation first, then you do not need to redefine the client options for each call
- MAJOR: throughout the APIs, use dictionary parameters rather than multiple optional params
- MAJOR: getEntries replaces getAllEntries, getEntriesByTypeId and getEntriesByIds
- MAJOR: getAssetStreamById was renamed to getAssetById
- MAJOR: validateSession was removed (incorrectly fell back to getApplicationStatus).
- MAJOR: removed the method to update the uuid of an existing session
- MAJOR: renamed the uuid optional parameter (when creating a client) to deviceId
- MINOR: getEntries can take an alias parameter (an array of aliases)
- MINOR: Added getEntryByAlias
- PATCH: Added automatically generated docs
- PATCH: Renamed this library and repo name, this is the SDK for Node.js, not for "the web".
- PATCH: Renamed npm scripts (build rather than compile, new doc scripts, etc)
- PATCH: Now with an Apache-2.0 license, and published on npm !

# 1.1.1

Start of this changelog
