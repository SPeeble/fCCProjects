const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  let newid
  
  test('Create an issue with every field', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/test')
      .type('form')
      .send({
        issue_title: 'Application crashes on launch',
        issue_text: 'Application runs for 3 seconds before closing',
        created_by: 'Bob H',
        assigned_to: 'Jim T',
        status_text: 'In progress'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.issue_title, 'Application crashes on launch');
        assert.equal(res.body.issue_text, 'Application runs for 3 seconds before closing');
        assert.exists(res.body._id);
        newid = res.body._id
        done();
      })
  });

  test('Create an issue with only required fields', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/test')
      .type('form')
      .send({
        issue_title: 'Settings menu not interactable',
        issue_text: 'Settings menu cannot be navigated or interacted with',
        created_by: 'Jim T'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.issue_title, 'Settings menu not interactable');
        assert.equal(res.body.assigned_to, '');
        assert.exists(res.body._id);
        done();
      })
  });

  test('Create an issue with missing required fields', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/test')
      .type('form')
      .send({
        issue_title: 'Settings not saving',
        issue_text: 'Settings cannot be saved'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'required field(s) missing');
        done();
      })
  });

  test('View issues on a project', function(done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/test')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      })
  });

  test('View issues on a project with one filter', function(done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/test?assigned_to=Jim+T')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        let meetsCriteria = true
        res.body.forEach(issue => {
          if (issue.assigned_to !== 'Jim T') {
            meetsCriteria = false
          }
        })
        assert.isTrue(meetsCriteria)
        done();
      })
  });

  test('View issues on a project with multiple filters', function(done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/test?assigned_to=Jim+T&created_by=Bob+H')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        let meetsCriteria = true
        res.body.forEach(issue => {
          if (issue.assigned_to !== 'Jim T' || issue.created_by !== 'Bob H') {
            meetsCriteria = false
          }
        })
        assert.isTrue(meetsCriteria)
        done();
      })
  });

  test('Update one field on an issue', function(done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/test')
      .send({
        _id: '65c98369b490b378e8799be8',
        issue_title: 'Application fails to load'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, '65c98369b490b378e8799be8');
        done();
      })
  });

  test('Update multiple fields on an issue', function(done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/test')
      .send({
        _id: '65c98369b490b378e8799be8',
        issue_title: 'Application starts up with a black screen',
        issue_text: 'Application launches but cannot be interacted with'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, '65c98369b490b378e8799be8');
        done();
      })
  });

  test('Update an issue with missing _id', function(done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/test')
      .send({
        issue_title: 'Application fails to load'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'missing _id');
        done();
      })
  });

  test('Update an issue with no fields to update', function(done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/test')
      .send({
        _id: '65c98369b490b378e8799be8'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'no update field(s) sent');
        assert.equal(res.body._id, '65c98369b490b378e8799be8');
        done();
      })
  });

  test('Update an issue with an invalid _id', function(done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/test')
      .send({
        _id: 'invalidId',
        issue_title: 'Application fails to load'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'could not update');
        assert.equal(res.body._id, 'invalidId');
        done();
      })
  });

  test('Delete an issue', function(done) {
    chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/test')
      .send({
        _id: newid
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.result, 'successfully deleted');
        assert.equal(res.body._id, newid);
        done();
      })
  });

  test('Delete an issue with an invalid _id', function(done) {
    chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/test')
      .send({
        _id: 'invalidId'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'could not delete');
        assert.equal(res.body._id, 'invalidId');
        done();
      })
  });

  test('Delete an issue with missing _id', function(done){
    chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/test')
      .send({})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'missing _id');
        done();
      })
  });
  
});
