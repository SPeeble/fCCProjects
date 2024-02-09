const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  //Convert a valid input such as 10L
  test('Convert 10L', function(done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/convert?input=10L')
      .end(function(err, res) {
        assert.equal(res.body.returnNum, 2.64172);
        assert.equal(res.body.returnUnit, 'gal');
        done();
      })
  });
  //Convert an invalid input such as 32g
  test('Convert 32g', function(done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/convert?input=32g')
      .end(function(err, res) {
        assert.equal(res.text, 'invalid unit');
        done();
      });
  })
  //Convert an invalid number such as 3/7.2/4kg
  test('Convert 3/7.2/4kg', function(done) {
    chai 
      .request(server)
      .keepOpen()
      .get('/api/convert?input=3/7.2/4kg')
      .end(function(err, res) {
        assert.equal(res.text, 'invalid number');
        done();
      })
  })
  //Convert an invalid number and unit such as 3/7.2/4kilomegagram
  test('Convert 3/7.2/4kilomegagram', function(done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/convert?input=3/7.2/4kilomegagram')
      .end(function(err, res) {
        assert.equal(res.text, 'invalid number and unit');
        done();
      })
  })
  //Convert with no number such as kg
  test('Convert kg', function(done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/convert?input=kg')
      .end(function(err, res) {
        assert.equal(res.body.returnNum, 2.20462);
        assert.equal(res.body.returnUnit, 'lbs');
        done();
      })
  })
});
