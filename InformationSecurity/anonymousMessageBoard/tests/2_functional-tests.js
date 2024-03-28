const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const mongoose = require('mongoose');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  this.timeout(5000);
  
  let testid
  let replyid

  test('Creating a new thread: POST request to /api/threads/{board}', function(done) {
    chai.request(server)
      .post('/api/threads/test')
      .send({
        text: 'test thread',
        delete_password: 'password'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        chai.request(server)
          .get('/api/threads/test')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], '_id');
            testid = res.body[0]._id
            assert.property(res.body[0], 'text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'bumped_on');
            assert.property(res.body[0], 'replies');
            assert.property(res.body[0], 'replycount');
            assert.isArray(res.body[0].replies);
            done();
          })
      });
  })

  test('Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}', function(done) {
    chai.request(server)
      .get('/api/threads/test')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.isAtMost(res.body.length, 10);
        assert.property(res.body[0], '_id');
        assert.property(res.body[0], 'text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'bumped_on');
        assert.property(res.body[0], 'replies');
        assert.property(res.body[0], 'replycount');
        assert.isArray(res.body[0].replies);
        assert.isAtMost(res.body[0].replies.length, 3);
        done();
      })
  })

  test('Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password', function(done) {
    chai.request(server)
      .delete('/api/threads/test')
      .send({
        thread_id: testid,
        delete_password: 'wrong password'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'incorrect password');
        done();
      })
  })

  test('Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password', function(done) {
    chai.request(server)
      .delete('/api/threads/test')
      .send({
        thread_id: testid,
        delete_password: 'password'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'success');
        done();
      })
  })

  test('Reporting a thread: PUT request to /api/threads/{board}', function(done) {
    chai.request(server)
    .post('/api/threads/test')
    .send({
      text: 'test thread 2',
      delete_password: 'password'
    })
    .end(function(err, res) {
      chai.request(server)
      .get('/api/threads/test')
      .end(function(err, res) {
        testid = res.body[0]._id
        chai.request(server)
          .put('/api/threads/test')
          .send({
            thread_id: testid
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'reported');
            done();
        })
      })
    });
  })

  test('Creating a new reply: POST request to /api/replies/{board}', function(done) {
    chai.request(server)
      .post('/api/replies/test')
      .send({
        thread_id: testid,
        text: 'test reply',
        delete_password: 'password'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        chai.request(server)
        .get('/api/threads/test')
        .end(function(err, res) {
          assert.isAtLeast(res.body[0].replies.length, 1);
          replyid = res.body[0].replies[0]._id
          done();
        })
      })
  })

  test('Viewing a single thread with all replies: GET request to /api/replies/{board}', function(done) {
    chai.request(server)
      .get('/api/replies/test?thread_id=' + testid)
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, '_id');
        assert.property(res.body, 'text');
        assert.isAtLeast(res.body.replies.length, 1)
        done()
      })
  })

  test('Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_password', function(done) {
    chai.request(server)
      .delete('/api/replies/test')
      .send({
        thread_id: testid,
        reply_id: replyid,
        delete_password: 'wrong password'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'incorrect password');
        done();
      })
  })

  test('Reporting a reply: PUT request to /api/replies/{board}', function(done) {
    chai.request(server)
    .put('/api/replies/test')
    .send({
      thread_id: testid,
      reply_id: replyid
    })
    .end(function(err, res) {
      assert.equal(res.status, 200);
      assert.equal(res.text, 'reported');
      done()
    });
  })

  test('Deleting a reply with the correct password: DELETE request to /api/replies/{board} with a valid delete_password', function(done) {
    chai.request(server)
      .delete('/api/replies/test')
      .send({
        thread_id: testid,
        reply_id: replyid,
        delete_password: 'password'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'success');
        chai.request(server)
        .get('/api/replies/test?thread_id=' + testid)
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.replies[0].text, '[deleted]')
          chai.request(server)
            .delete('/api/threads/test')
            .send({
              thread_id: testid,
              delete_password: 'password'
            })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'success');
              done()
            })
        })
      })
  })

});
