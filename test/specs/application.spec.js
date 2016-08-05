import chai from 'chai';
import AppGrid from '../../src/index';

import appGridOptions from '../appGridOptions';

chai.should();

describe('Application API Tests', () => {
  it('The API should exist and contain the expected functions', () => {
    AppGrid.application.getStatus.should.be.a('function');
  });

  it('"getStatus" should return the status AppGrid', (done) => {
    AppGrid.application.getStatus(appGridOptions)
      .then(({ json: { status } }) => {
        status.should.be.ok;
        done();
      });
  });
});
