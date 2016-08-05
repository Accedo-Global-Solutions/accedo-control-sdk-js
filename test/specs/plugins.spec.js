/* eslint-disable no-unused-expressions */

import chai from 'chai';
import AppGrid from '../../src/index';

import appGridOptions from '../appGridOptions';

chai.should();

describe('Plugins API Tests', () => {
  it('The API should exist and contain the expected functions', () => {
    AppGrid.plugins.should.be.an('object');
    AppGrid.plugins.getAllEnabledPlugins.should.be.a('function');
  });

  it('"getAllEnabledPlugins" should return an array from AppGrid', (done) => {
    AppGrid.plugins.getAllEnabledPlugins(appGridOptions)
      .then(({ json: plugins }) => {
        plugins.should.be.ok;
        plugins.should.be.an('array');
        done();
      });
  });
});
