'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema

const issueSchema = new Schema({
  issue_title: {type: String, required: true},
  issue_text: {type: String, required: true},
  created_on: {type: Date, required: true},
  updated_on: {type: Date, required: true},
  created_by: {type: String, required: true},
  assigned_to: {type: String, required: false},
  open: {type: Boolean, required: true, default: true},
  status_text: {type: String, required: false},
  project: {type: String, required: true}
});

const Issue = new mongoose.model('issue', issueSchema);

module.exports = function (app) {

  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let queries = req.query;
      const findRequests = Issue.find({project: project});
      for (let key in queries) {
        findRequests.where(key).equals(queries[key]);
      };
      findRequests.exec(function(err, data) {
        if (err) {return console.log(err)}
        let dataArr = data.map(function(issue) {
          return {
            _id: issue._id,
            issue_title: issue.issue_title,
            issue_text: issue.issue_text,
            created_on: issue.created_on,
            updated_on: issue.updated_on,
            created_by: issue.created_by,
            assigned_to: issue.assigned_to,
            open: issue.open,
            status_text: issue.status_text
          };
        });
        res.send(dataArr);
      });
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let {issue_title, issue_text, created_by, assigned_to, status_text} = req.body;
      if (!issue_title || !issue_text || !created_by) {
        return res.json({error: 'required field(s) missing'});
      }
      let newIssue = new Issue({
        issue_title: issue_title,
        issue_text: issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: created_by,
        assigned_to: assigned_to || "",
        open: true,
        status_text: status_text || "",
        project: project
      })
      newIssue.save(function(err, data) {
        if (err) {return res.json({error: 'failed to save to MongoDB'})};
        res.json({
          _id: data._id,
          issue_title: data.issue_title,
          issue_text: data.issue_text,
          created_on: data.created_on,
          updated_on: data.updated_on,
          created_by: data.created_by,
          assigned_to: data.assigned_to,
          open: data.open,
          status_text: data.status_text
        });
      })
    })
    
    .put(function (req, res){
      //let project = req.params.project;
      let id = req.body._id;
      if (!req.body._id) { res.json({error: 'missing _id'}); return; }
      if (Object.keys(req.body).length === 1) {res.json({error: 'no update field(s) sent', '_id': id}); return;};
      let updateObj = {};
      for (let key in req.body) {
        if (key !== '_id') {
          updateObj[key] = req.body[key];
        }
      }
      updateObj.updated_on = new Date();
      Issue.findOneAndUpdate({_id: req.body._id}, updateObj, {new: true}, function(err, data) {
        if (!data || err) {return res.json({error: 'could not update', '_id': req.body._id})};
        res.json({result: 'successfully updated', '_id': req.body._id});
      });
    })
    
    .delete(function (req, res){
      //let project = req.params.project;
      if (!req.body._id) { res.json({error: 'missing _id'}); return; }
      let id = req.body._id;
      Issue.findOneAndDelete({ '_id': req.body._id}, function(err, data) {
        if (!data || err) { res.json({ error: 'could not delete', '_id': id }); return; }
        res.json({ result: 'successfully deleted', _id: id });
      });
    });
    
};
