# TODO

- MINOR: automatically generated docs
- MINOR: add Express-compatible middleware to handle the session propagation and re-creation on expiry
- MAJOR: have APIs usable without the first options parameter, and a way to define them once for all successive calls
- MAJOR: throughout the APIs, use dictionary parameters as in AppGrid.contentEntries.getEntries rather than multiple optional params
- MAJOR: validateSession does not call the application.getStatus API any more

# in master, unreleased

- MAJOR: Appgrid.session.getStatus was moved to Appgrid.application.getStatus
- MAJOR: AppGrid.contentEntries.getEntries replaces getAllEntries, getEntriesByTypeId and getEntriesByIds
- MISC: Renamed this library and repo name, this is the SDK for Node.js, not for "the web".

# 1.1.1

Start of this changelog
