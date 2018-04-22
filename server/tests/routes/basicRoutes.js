

const should = require('should');
const request = require('request');
const expect = require('chai').expect;
const config = require('./../../../config/config');

let CorrectStatus,
  wrongStatus;

describe('Basic routes:', () => {
  before((done) => {
    done();
  });

  describe('Test app entry route', () => {
    it('should give Status 200', (done) => {
      request.get(`${config.baseUrl}/`, (err, res, body) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });

  after((done) => {
    done();
  });
});
