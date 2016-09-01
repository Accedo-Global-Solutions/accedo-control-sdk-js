# TODO

- MINOR: add getEntryByTypeAlias when available in prod
- MINOR: add the new bulk method to add applogs when available in prod
- MINOR: basic robot detection with a default deviceId for them all ?
- MINOR: ensure only one new session may be created at a time, in case of many calls happening before the first finishes

# 2.2.0

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
