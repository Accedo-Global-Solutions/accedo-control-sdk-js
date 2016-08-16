# TODO

- MINOR: automatically generated docs
- MINOR: add Express-compatible middleware to handle the session propagation and re-creation on expiry
- MAJOR: have APIs usable without the first options parameter, and a way to define them once for all successive calls
- MINOR: validateSession may be able to check the session has expired or not before making any call ?
- MINOR: add getEntryByTypeAlias when available in prod

# in master, unreleased

- MAJOR: getStatus was moved from Appgrid.session to Appgrid.application
- MAJOR: getEntries replaces getAllEntries, getEntriesByTypeId and getEntriesByIds
- MAJOR: validateSession used to call the getStatus API and yield something depending on it. Now it only checks there exists a sessionId in the options.
- MAJOR: throughout the APIs, use dictionary parameters as in getEntries rather than multiple optional params
- MINOR: Added getEntries can take an alias parameter (an array of aliases)
- MINOR: Added getEntryByAlias
- MISC: Renamed this library and repo name, this is the SDK for Node.js, not for "the web".

# 1.1.1

Start of this changelog
