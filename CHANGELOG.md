# 3.1.3

- Change the fetch polyfill to save 3kB on the browser build
- Apply the easy dependency updates

# 3.1.2

- FIX: Change the asset download endpoint (we were using a deprecated one that is down at the moment). Change the tested asset ID as the previous one is gone.

# 3.1.1

- FIX: fix the `package.engine` field to avoid warnings/errors on Node 5, 6, 7

# 3.1.0

- FEATURE: add getAvailableLocales method
- FEATURE: content APIs can specify a `locale` in the option argument
- FIX: add a browser field to package.json, fixes issues with minified webpack builds

# 3.0.4

- FIX: Stop passing unnecessary query parameters to most API requests

# 3.0.3

- FIX: Fixed the ES6 example that was using a string rather than an array for the `typeId` parameter

# 3.0.2

- FIX: instead of throwing an error when a sessionKey is provided without a deviceId, just ignore the sessionKey (a new one will be created). Thanks for the bug report @artgryn

# 3.0.1

- FIX: update the builds and doc, as v3.0.0 was slightly outdated

# 3.0.0

- BREAKING: streamline the API by accepting only an array for the typeId parameter in getEntries
- BREAKING: different bundles are now provided, as noted above.
- BREAKING: move express-related code to [a separate repo](https://github.com/Accedo-Products/appgrid-sdk-express)
- BREAKING: remove deprecated `getCurrentTimeOfDayDimValue` method
- BREAKING: remove `appgrid.generateUuid` method (not necessary - the SDK generates one if needed)
- FIX: only one unit test was run due to a mistake in 2.3.0
- use yarn lockfile rather than npm shrinkwrap
- compatible with most browsers (down to ES5 via Webpack or the UMD build)
- add a browser-specific default implementation to persist the deviceId, customisable

:sparkles: **This is the first release targeting browsers as well as Node !**

For browsers you can use a module bundler as you probably already do (Webpack, Rollup, Browserify...), then it's up to you to also include a compilation step (Babel, etc); or a good old script tag pointing to the file in `dist/appgrid.min.js` (that file is minified and compiled to ES5).

Also, note we used to have an ES6 (with ES6 module) and an UMD (with CommonJS) build.
The ES6 build is intended for intended for use by module bundlers (like Webpack) or Node.js, and uses CommonJS.
The UMD build is intended for browsers if you do not use a module bundler (using a script tag or tools like RequireJS), it includes dependencies and is minified.

Providing an ES6 module (with the new import/export syntax) in another bundle made little sense as there is just one default export that you should use.

:warning: **Upgrade guide from 2.x**

If you were using the Express middleware, you should now install [appgrid-express](https://github.com/Accedo-Products/appgrid-sdk-express) and its default export rather than `appgrid.middleware.express`. You can remove appgrid from your dependencies as appgrid-express imports it itself.

If you  were using the `getEntries` method with the `typeId` option as a string, please now always pass an array, even for a single value. This is similar to how the `id` and `alias` options behave.

Most likely, you did not use the deprecated `getCurrentTimeOfDayDimValue` method (otherwise you may want to copy its code from v2 into your own application).

# 2.3.0

- FEATURE: getEntries can now take a typeAlias parameter
- FEATURE: getEntries's typeId parameter can now be an array of strings (previously, only a string)
- FEATURE: Added the new method to add Application Logs in batch (sendLogs)
- FEATURE: have extra configuration params given go through the middleware so they are used in the factory (log, gid, etc)
- FEATURE: by default, the middleware will now pass the gid from each request parameter (if found in the `gid` querystring) to the factory
- FIX: The sendLog method was not sending log dimensions properly.
- FIX: The sendLog method's metadata param can be anything (not only an array as documented).
- FIX: Changed the AppGrid REST API link to its new location
- FIX: doc: installing this SDK should usually be done with --save, not --save-dev
- the static method getCurrentTimeOfDayDimValue was deprecated, will be removed in version 3
- updated non-breaking dependencies

# 2.2.1

- FIX: Replaced the old link to AppGrid's help section with the new one for the knowledge base

# 2.2.0

- FEATURE: Added ip optional param on AppGrid client instantiation
- FEATURE: Express middleware: automatically pass on the IP for each client it creates
- FEATURE: ensure only one new session may be created at a time, in case of many calls happening before the first finishes
- FIX: Replaced object spread by Object.assign so that we do not need any transpilation for the ES6 bundle
- FIX: The ES6 bundle was transpiled to ES5 (except for import/export), not any more

# 2.1.0

- FEATURE: Added a middleware for Express to handle the session and deviceId propagation on server requests/responses
- FIX: Now checking against the HTTP response status (401) to recreate a session. Fixes a bug as the JSON response for this seems to have changed slightly.
- Added the npm chip to the README

# 2.0.0

- BREAKING: big overhaul, all APIs changed, the first step is to go through client creation first, then you do not need to redefine the client options for each call
- BREAKING: throughout the APIs, use dictionary parameters rather than multiple optional params
- BREAKING: getEntries replaces getAllEntries, getEntriesByTypeId and getEntriesByIds
- BREAKING: getAssetStreamById was renamed to getAssetById
- BREAKING: validateSession was removed (incorrectly fell back to getApplicationStatus).
- BREAKING: removed the method to update the uuid of an existing session
- BREAKING: renamed the uuid optional parameter (when creating a client) to deviceId
- FEATURE: getEntries can take an alias parameter (an array of aliases)
- FEATURE: Added getEntryByAlias
- FIX: Renamed this library and repo name, this is the SDK for Node.js, not for "the web".
- Added automatically generated docs
- Renamed npm scripts (build rather than compile, new doc scripts, etc)
- Now with an Apache-2.0 license, and published on npm !

# 1.1.1

Start of this changelog
