import { getValidatedOptions } from './options';
import { grab } from './apiHelper';

const rawGetStatus = options => grab(`${options.appGridUrl}/status`, options);

const getStatus = (options) => getValidatedOptions(options).then(rawGetStatus);

export { getStatus, rawGetStatus };
