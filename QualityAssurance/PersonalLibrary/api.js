/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {type: String, required: true}
});

const commentSchema = new mongoose.Schema({
  bookId: {type: String, required: true},
  comment: {type: String, required: true}
});


const Book = mongoose.model('Book', bookSchema);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = function (app) {

  mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

  app.route('/api/books')
    .get(function (req, res){
      Book.find(function(err, books) {
        if (err) { console.log(err); res.send('Failed to get books'); return; }
        
        Comment.find(function(commentErr, comments) {
          if (commentErr) { console.log(commentErr); res.send('Failed to get comments'); return; }
          
          const responseArray = [];
          for (let i = 0; i < books.length; i++) {
            const book = books[i];
            let bookComments = comments.filter(function(comment) {
              return comment.bookId == book._id;
            }).map(function(comment) {
              return comment.comment;
            })
            const commentCount = bookComments.length
            const bookObject = {
              _id: book._id,
              title: book.title,
              commentcount: commentCount,
            }
            responseArray.push(bookObject);
          }
          res.send(responseArray);
        })
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if (!title) { res.send('missing required field title'); return; }
      Book.findOne({title: title}, function(err, data) {
        if (err) { console.log(err); res.send('Failed to get book'); return; }
        if (data) { res.json({_id: data._id, title: data.title}); return; }
        let newBook = new Book({title: title});
        newBook.save(function(bookErr, bookData) {
          if (bookErr) { console.log(err); res.send('Failed to save book'); return; }
          res.json({_id: bookData._id, title: bookData.title});
        });
      });
    })
    
    .delete(function(req, res){
      Book.deleteMany(function(err, data) {
        if (err) { console.log(err); res.send('Failed to delete books'); return; };

        Comment.deleteMany(function(commentErr, commentData) {
          if (commentErr) { console.log(commentErr); res.send('Failed to delete comments'); return; };
          res.send('complete delete successful');
        })
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      Book.findById(bookid, function(err, book) {
        if (!book || err) { res.send('no book exists'); return; };
        Comment.find({bookId: bookid}, function(commentErr, comments) {
          if (commentErr) { console.log(commentErr); res.send('Failed to get comments'); return; };
          if (comments.length > 0) {
            comments = comments.map(function(comment) { return comment.comment; });
          }
          res.json({
            _id: book._id,
            title: book.title,
            comments: comments
          });
        })
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) { res.send('missing required field comment'); return; };
      Book.findById(bookid, function(err, book) {
        if (!book || err) { res.send('no book exists'); return; };
        const newComment = new Comment({
          bookId: bookid,
          comment: comment
        });
        newComment.save(function(commentSaveErr, commentData) {
          if (commentSaveErr) { res.send('Failed to save comment'); return; };
          
          Comment.find({bookId: bookid}, function(commentErr, comments) {
            if (commentErr) { console.log(commentErr); res.send('Failed to get comments'); return; };
            comments = comments.map(function(comment) { return comment.comment; })
            res.json({
              _id: bookid,
              title: book.title,
              comments: comments
            });
          });
        });
      });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      Book.findOneAndDelete({_id: bookid}, function(err, book) {
        if (!book || err) { res.send('no book exists'); return; };
        Comment.deleteMany({bookId: bookid}, function(commentErr, commentData) {
          if (commentErr) { console.log(commentErr); res.send('Failed to delete comments'); return; };
          res.send('delete successful')
        })
      })
    });
  
};
