'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// TODO JASON: Figure out how to make these more dynamic (user-configurable if needed)

var errorCodes = exports.errorCodes = {
  notFound: '001', // Requested item has not been found
  network: '002', // Generic network problem during communication
  internal: '003', // Internal error (such as backend service internal error)
  unauthorized: '004', // Unauthorized to access the requested item
  invalidResponse: '005', // Error while parsing response as it's invalid
  io: '006', // Storing resource failed or an IO error during reading
  emptyCollection: '007', // The request returns an empty dataset
  serviceUnavailable: '008', // The Service is not available
  invalidAsset: '009', // The asset is invalid (Missing/Invalid properties etc)
  unknown: '911' // Unknown / Un-categorizable error. A catch-all error and should not be used in most cases as there often is a more specific code
};

var facilityApiCodes = exports.facilityApiCodes = {
  status: 11,
  configuration: 12,
  log: 13,
  content: 14,
  search: 15,
  other: 99
};

var sources = exports.sources = {
  backend: 'backend',
  middleware: 'service-mw'
};

var views = exports.views = {
  none: ''
};