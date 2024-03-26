const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  test('Viewing one stock: GET request to /api/stock-prices/', function(done) {
    chai.request(server)
    .keepOpen()
    .get('/api/stock-prices?stock=GOOG')
    .end((err, res) => {
      assert.equal(res.status, 200)
      assert.equal(res.body.stockData.stock, 'GOOG')
      assert.isNumber(res.body.stockData.price)
      assert.isNumber(res.body.stockData.likes)
      done()
    })
  })

  test('Viewing one stock and liking it: GET request to /api/stock-prices/', function(done) {
    chai.request(server)
    .keepOpen()
    .get('/api/stock-prices?stock=IMPP&like=true')
    .end((err, res) => {
      assert.equal(res.status, 200)
      assert.equal(res.body.stockData.stock, 'IMPP')
      assert.isNumber(res.body.stockData.price)
      assert.equal(res.body.stockData.likes, 1)
      done()
    })
  })

  test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', function(done) {
    chai.request(server)
    .keepOpen()
    .get('/api/stock-prices?stock=IMPP&like=true')
    .end((err, res) => {
      assert.equal(res.status, 200)
      assert.equal(res.body.stockData.stock, 'IMPP')
      assert.isNumber(res.body.stockData.price)
      assert.equal(res.body.stockData.likes, 1)
      done()
    })
  })

  test('Viewing two stocks: GET request to /api/stock-prices/', function(done) {
    chai.request(server)
    .keepOpen()
    .get('/api/stock-prices?stock=IMPP&stock=AMD')
    .end((err, res) => {
      assert.equal(res.status, 200)
      assert.isArray(res.body.stockData)
      assert.equal(res.body.stockData[0].stock, "IMPP")
      assert.equal(res.body.stockData[1].stock, "AMD")
      assert.isNumber(res.body.stockData[0].price)
      assert.isNumber(res.body.stockData[1].price)
      done()
    })
  })

  test('Viewing two stocks and liking them: GET request to /api/stock-prices/', function(done) {
    chai.request(server)
    .keepOpen()
    .get('/api/stock-prices?stock=IMPP&stock=AMD&like=true')
    .end((err, res) => {
      assert.equal(res.status, 200)
      assert.isArray(res.body.stockData)
      assert.equal(res.body.stockData[0].stock, "IMPP")
      assert.equal(res.body.stockData[1].stock, "AMD")
      assert.isNumber(res.body.stockData[0].price)
      assert.isNumber(res.body.stockData[1].price)
      assert.equal(res.body.stockData[0].rel_likes, 0)
      assert.equal(res.body.stockData[1].rel_likes, 0)
      done()
    })
  })
});
