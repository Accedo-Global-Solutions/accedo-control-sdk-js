# 4.0.1

- FIX: documentation: the `errorCode` parameter in the `sendLog` method should be a number, not a string

And, for **browsers only**:
- FIX: the `sendLog` method will now auto-batch several logs over a period of time and depending on a size limit.
The batch will also be tentatively flushed when the user navigates away.

# 4.0.0
- BREAKING: in the functions related to application logs, the `facilityCode` property is now ignored. It used to be prepended to the `errorCode` when defined. This was a relic from a bespoke development that has nothing to do with Accedo One itself.
Most likely, you were not using it. If you somehow did, only rely on the `errorCode` instead from now on.
- BREAKING: the `getAssetById` method has been removed. It was already deprecated and nobody should relied on fetching assets by their ids.
- BREAKING: this library is now published on NPM as `@accedo/accedo-one`, so you should now `npm install @accedo/accedo-one --save` or `yarn add @accedo/accedo-one`.

And, for **browsers only**:
- BREAKING: when this SDK is used through the UMD build, the global variable attached to `window` is now named `accedoOne` instead of `appgrid`. Same applies to the module name you should use in a requireJS-like statement.

:sparkles: This is the first release published in NPM as @accedo/accedo-one.

Accedo One is the new product that replaces AppGrid, and will bring additional possibilities

As well as the new name-related breaking changes, we took the opportunity to remove things that were either deprecated or that did not have their place here.
See details in the list above. We expect this major update to be painless for most people - just make sure to use the `accedoOne` identifier instead of `appgrid` on browsers.

# 3.2.4

- When calling `getLogLevel`, the result will be cached for 3 minutes and reused with no network call within that period.
- Separated the Node and browser index files and differing sources (appLogs only for now)
- Replaced Mocha, Chai and Sinon with Jest
- Replaced all import/export ES6 Module statements by CommonJS require/module.exports. This allows us to run tests without a build step, and also run them in 'watch' mode if we like. Also, this means there's no build step needed any more for the Node library, nor for the Node example, so no more rollup configuration is needed for those.
- Now using Prettier for code style formatting
- This library now mentions Accedo One rather than AppGrid as this is the new product's name. All relevant URLs have been updated. Developement will soon continue on a different repository, and the NPM library will be published under a different name too. More information will follow in this changelog.

And, for **browsers only**:
- Calling `sendLog` will transparently call `getLogLevel` (using the cache if any). If sending the log is not necessary, as when the level is set to 'off' for instance, it won't be sent.

# 3.2.3

- FIX: Similar to version 3.2.2, this solves a new issue with Web Storage following the release of Safari 11.
Here, an uncaught exception was thrown on Safari 11 when a user setting was forbidding the storage of website data.
Interestingly, the mere fact of checking whether `localStorage` exists (using `typeof`) was enough to cause the crash.
- All safe dependency updates

# 3.2.2

- FIX: #7 - The default, browser-only persistency strategy (towards Web Storage) failed on private-mode browsing, and when the browser Web Storage was full, causing an exception. This is now silently caught.
Thanks to @SNikon who reported the issue.

# 3.2.1

- FIX: Better display on application logs, when viewed in the AppGrid webpage.
When no metadata is given, the log message will appear as is on Appgrid (without a useless suffix).
When one metadata argument is given, the log message will appear as a JSON array (message first, metadata second).
When more metadata args are given, the same will happen but the second array item will be an array.

# 3.2.0

- FEATURE: You can now change the target endpoint with the `target` option (the default is still the production AppGrid API URL).
Possible use: target a proxy to avoid all CORS pre-flight requests (when using the SDK from the browser), or modify the requests before redirecting them to AppGrid (allowing you to fix the request headers IE/Edge sends unencoded).
- Updated dev dependencies

# 3.1.4

:warning: **This is an important fix, especially when using this SDK server-side**

- FIX: A race condition on an expectedly shared method means AppGrid sessions were sometimes not created when they should, so the very next calls for the affected instances would fail.
This problem is unlikely to affect you if you used the SDK on the browser, but it will definitely affect you if you use it on the server and your traffic is not very low.
Thanks to @nicolas-nannoni for pointing at this issue.
- Remove the getAssetById method from the docs. It is deprecated and will be removed in version 4.
Use getAllAssets instead, as the asset IDs and URLs may change without warning.

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
