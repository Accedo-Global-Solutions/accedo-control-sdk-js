# TODO

- MINOR: automatically generated docs
- MINOR: add Express-compatible middleware to handle the session propagation and re-creation on expiry
- MINOR: add getEntryByTypeAlias when available in prod

# in master, unreleased

- MAJOR: big overhaul, all APIs changed, the first step is to go through client creation first, then you do not need to redefine the client options for each call
- MAJOR: throughout the APIs, use dictionary parameters as in getEntries rather than multiple optional params
- MAJOR: getEntries replaces getAllEntries, getEntriesByTypeId and getEntriesByIds
- MAJOR: validateSession used to call the getStatus API and yield something depending on it. Now it only checks there exists a sessionId in the options.
- MAJOR: removed the method to update the uuid of an existing session
- MINOR: Added getEntries can take an alias parameter (an array of aliases)
- MINOR: Added getEntryByAlias
- MISC: Renamed this library and repo name, this is the SDK for Node.js, not for "the web".

# 1.1.1

Start of this changelog
