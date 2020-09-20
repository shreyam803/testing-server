var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

router.use(express.json());

const User = require('../models/user');

router.post('/register', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        res.statusCode = 409;
        res.end('Mail exists Try some other mail');
        
      }
      else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            err = new Error('Error');
            err.status = 500;
            return next(err);
          }
          else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              name: req.body.name,
              email: req.body.email,
              password: hash
            });
            user.save()
              .then(result => {
                console.log(result);
                res.end('Registration Successful');
                res.statusCode = 200;
              }, (err) => next(err))
              .catch((err) => next(err));
          }
        });
      }
    });

});
router.post('/login', (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        
        res.statusCode = 401;
        res.end('Mail not found,user doesn\'t exist');
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          err = new Error('Error');
          err.status = 500;
          return next(err);

        }
        if (result) {
          res.end('Logged in Successfully');
          res.statusCode = 200;
        }
        // err = new Error('Authentication Failed');
        //   err.status = 500;
        //   return next(err);
        
        res.statusCode = 401;
        res.end('Authentication Failed');
      });
    })
    .catch((err) => next(err));

});
module.exports = router;
