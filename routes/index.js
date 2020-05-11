var express = require('express');
var router = express.Router();
//get controllers(
  var userAction = require('../controllers/userAction');
//get models
var User = require('../models/Users');


/* GET home page. */
router.get('/', userAction.homeGet);

//sign up
//get
router.get('/signUpGet',userAction.signUpGet);
//post
router.post('/signUpPost',userAction.signUpPost);


//login
router.get('/loginGet',userAction.loginGet);
const passport = require("passport");
var path = require('path');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;

//login authetntciation
passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) { 
          return done(err);
        };
        if (!user) {
          return done(null, false, { msg: "Incorrect username" });
        }
        if (user.password !== password) {
          return done(null, false, { msg: "Incorrect password" });
        }
        return done(null, user);
      });
    })
  );
  
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  router.post('/loginPost', 
  passport.authenticate('local', {
    
    successRedirect: '/baraaktiisSpace',
    failureRedirect: '/loginGet'
  })
);



router.get('/logOut', (req, res) => {
    req.logout();
    res.redirect('/');
  });




  
//baraaktiiska adminstartion
router.get('/baraaktiisSpace', userAction.baraaktiisSpace);
router.get('/inputQuestionGet', userAction.inputQuestionGet);
router.post('/inputQuestionPost', userAction.inputQuestionPost);

//baraaktiisquestions
fs = require('fs');

router.get('/practiceQuestions1', userAction.practiceQuestion);
router.get('/nextQuestion', userAction.nextQuestion);
router.get('/previousQuestion', userAction.previousQuestion);
//finish previous version to be allowed for the next one
router.get('/partFinished', userAction.partFinished);
router.get('/feedback', userAction.feedback)
//feedback
router.post('/feedback', userAction.feedbackPost)
//info
router.get('/about', userAction.about);
router.get('/ogaysiis', userAction.ogaysiis);




module.exports = router;
