# TODO

- MINOR: add Express-compatible middleware to handle the session propagation and re-creation on expiry
- MINOR: add getEntryByTypeAlias when available in prod
- MINOR: add the new bulk method to add applogs when available in prod

# in master, unreleased

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

# 1.1.1

Start of this changelog
