'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const replySchema = new mongoose.Schema({
  text: { required: true, type: String },
  delete_password: { required: true, type: String },
  created_on: { type: Date, default: new Date() },
  reported: { type: Boolean, default: false }
})

const threadSchema = new mongoose.Schema({
  board: { type: String, required: true },
  text: { required: true, type: String },
  delete_password: { required: true, type: String },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }],
  created_on: { type: Date, default: new Date() },
  bumped_on: { type: Date, default: new Date() },
  reported: { type: Boolean, default: false }
})

const Reply = mongoose.model('Reply', replySchema);

const Thread = mongoose.model('Thread', threadSchema);

module.exports = function (app) {

  mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

  app.route('/api/threads/:board')
    .post( async function(req, res) {
      try {
        const board = req.params.board;
        const text = req.body.text;
        const delete_password = req.body.delete_password;
        if (!text || !delete_password) { return res.json({Error: "Missing Field(s)"}) }
        const encryptedPass = bcrypt.hashSync(delete_password, saltRounds)
        const newThread = new Thread({
          board: board,
          text: text,
          delete_password: encryptedPass,
        });
        await newThread.save();
        res.redirect('/b/' + board + '/');
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
    })
    .delete( async function(req, res) {
      try {
        const thread_id = req.body.thread_id;
        const delete_password = req.body.delete_password;
        if (!thread_id || !delete_password) { return res.json({Error: "Missing Field(s)"}) }
        const thread = await Thread.findOne({ _id: thread_id }).populate('replies').exec();
        if (bcrypt.compareSync(delete_password, thread.delete_password)) {
          for (let i = 0; i < thread.replies.length; i++) {
            await Reply.deleteOne({ _id: thread.replies[i]._id });
          }
          console.log("deleting")
          await Thread.deleteOne({ _id: thread_id });
          res.send('success');
        } else {
          res.send('incorrect password');
        }
      } catch (err) {
        res.status(500).send('Server Error');
      }
    })
    .put( async function(req, res) {
      try {
        const thread_id = req.body.thread_id;
        if (!thread_id) { return res.json({Error: "Missing Field(s)"}) }
        const thread = await Thread.findOne({ _id: thread_id });
        if (thread) {
          thread.reported = true;
          await thread.save();
          res.send('reported');
        } else {
          res.send('could not find thread');
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
    })
    .get( async function(req, res) {
      try {
        const board = req.params.board;
        const thread_id = req.query.thread_id;
        if (thread_id) {
          const thread = await Thread.findOne({ _id: thread_id }).populate('replies').exec();
          if (thread) {
            const replies = thread.replies.map(reply => {
              return {
                _id: reply._id,
                text: reply.text,
                created_on: reply.created_on,
                bumped_on: reply.bumped_on
              }
            });
            return res.json({
              _id: thread._id,
              text: thread.text,
              created_on: thread.created_on,
              bumped_on: thread.bumped_on,
              replies: replies
            });
          } else {
            return res.send('could not find thread');
          }
        }
        const threads = await Thread.find({ board: board }).sort({ bumped_on: -1 }).limit(10).populate('replies').exec();
        const threadsArr = [];
        for (let i = 0; i < threads.length; i++) {
          const thread = threads[i];
          const replies = thread.replies.slice(0, 3).map(reply => {
            return {
              _id: reply._id,
              text: reply.text,
              created_on: reply.created_on,
              bumped_on: reply.bumped_on
            }
          })
          const threadObj = {
            _id: thread._id,
            text: thread.text,
            created_on: thread.created_on,
            bumped_on: thread.bumped_on,
            replies: replies,
            replycount: thread.replies.length
          }
          threadsArr.push(threadObj);
        }
        res.json(threadsArr);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
    })

  app.route('/api/replies/:board')
    .post( async function(req, res) {
      try {
        const board = req.params.board;
        const thread_id = req.body.thread_id;
        const text = req.body.text;
        const delete_password = req.body.delete_password;
        if (!thread_id || !text || !delete_password) { return res.json({Error: "Missing Field(s)"}) }
        const thread = await Thread.findOne({ _id: thread_id }).populate('replies').exec();
        if (thread) {
          const encryptedPass = bcrypt.hashSync(delete_password, saltRounds)
          const createdOn = new Date()
          const newReply = new Reply({
            text: text,
            delete_password: encryptedPass,
            created_on: createdOn
          })
          const savedReply = await newReply.save();
          thread.bumped_on = createdOn;
          thread.replies.push(savedReply._id);
          await thread.save();
          res.redirect('/b/' + board + '/' + thread_id);
        } else {
          res.send('could not find thread');
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
    })
    .delete( async function(req, res) {
      try {
        const thread_id = req.body.thread_id;
        const reply_id = req.body.reply_id;
        const delete_password = req.body.delete_password;
        if (!thread_id || !reply_id || !delete_password) { return res.json({Error: "Missing Field(s)"}) }
        const thread = await Thread.findOne({ _id: thread_id }).populate('replies').exec();
        if (thread) {
          const reply = thread.replies.find(reply => reply._id == reply_id);
          if (bcrypt.compareSync(delete_password, reply.delete_password)) {
            reply.text = '[deleted]';
            await reply.save();
            res.send('success');
          } else {
            res.send('incorrect password');
          }
        } else {
          res.send('could not find thread');
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
    })
    .put( async function(req, res) {
      try {
        const thread_id = req.body.thread_id;
        const reply_id = req.body.reply_id;
        if (!thread_id || !reply_id) { return res.json({Error: "Missing Field(s)"}) }
        const thread = await Thread.findOne({ _id: thread_id }).populate('replies').exec();
        if (thread) {
          const reply = thread.replies.find(reply => reply._id == reply_id);
          if (reply) {
            reply.reported = true;
            await reply.save();
            res.send('reported');
          } else {
            res.send('could not find reply');
          }
        } else {
          res.send('could not find thread');
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
    })
    .get( async function(req, res) {
      try {
        const board = req.params.board;
        const thread_id = req.query.thread_id;
        if (thread_id) {
          const thread = await Thread.findOne({ _id: thread_id }).populate('replies').exec();
          if (thread) {
            const replies = thread.replies.map(reply => {
              return {
                _id: reply._id,
                text: reply.text,
                created_on: reply.created_on,
                bumped_on: reply.bumped_on
              }
            });
            return res.json({
              _id: thread._id,
              text: thread.text,
              created_on: thread.created_on,
              bumped_on: thread.bumped_on,
              replies: replies
            });
          } else {
            return res.send('could not find thread');
          }
        }
        const threads = await Thread.find({ board: board }).sort({ bumped_on: -1 }).limit(10).populate('replies').exec();
        const threadsArr = [];
        for (let i = 0; i < threads.length; i++) {
          const thread = threads[i];
          const replies = thread.replies.slice(0, 3).map(reply => {
            return {
              _id: reply._id,
              text: reply.text,
              created_on: reply.created_on,
              bumped_on: reply.bumped_on
            }
          })
          const threadObj = {
            _id: thread._id,
            text: thread.text,
            created_on: thread.created_on,
            bumped_on: thread.bumped_on,
            replies: replies,
            replycount: thread.replies.length
          }
          threadsArr.push(threadObj);
        }
        res.json(threadsArr);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
    })
  
};
