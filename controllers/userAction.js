const {body, validationResult} = require('express-validator');
const {sanitizeBody} = require('express-validator');

var fs = require('fs');
var multer = require('multer');
var async = require('async');
var upload = multer({dest: 'uploads/'});
var url = require('url');

//get models
var User = require('../models/Users');
var Question = require('../models/Questions');
var Feedback = require('../models/Feedback');

//display homePage
exports.homeGet = function(req, res){
    res.render('home', {title: 'Baraaktiis Imtaxaanka Bermidka Ohio'});
};
//info
exports.about = function(req, res){
    res.render('about')
}
exports.ogaysiis = function(req, res){
    res.render('ogaysiis')
}

//signup
//get
exports.signUpGet = function(req, res){
    res.render('signup', {title: 'Is Qor Si Aad U Baraaktiis Garayso'});
};

//post: make new user and redirect to login
exports.signUpPost = function(req, res, next){
    //process requst
    let user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        password: req.body.password,
        progress: req.body.progress,
    }).save(err => {
        if(err){
            return next(err);
        }
        res.render('login', {title:'Kusoo Gal Akownkaaga Cusub'});
    });
    
};

//login
//display loginPage
exports.loginGet = function(req, res){
    res.render('login', {title:'Soo gal Baraaktiiska Imtaxaanka Bermidka'});
};

//adminstration
exports.inputQuestionGet = function(req, res){
    res.render('inputQuestion', {title:'Enter  a Question'});
};
exports.inputQuestionPost = function(req, res, next){
    //process requst
    let ques = new Question({
        question: req.body.question,
        answer1: req.body.answer1,
        answer2: req.body.answer2,
        answer3: req.body.answer3,
        correct: req.body.correct,
        part: req.body.part,
    }).save(err => {
        if(err){
            return next(err);
        }
        res.render('inputQuestion', {title:'Enter a Question'});
    });
    
};

//adminstration
exports.feedback = function(req, res){
    res.render('feedback', {title:'Nala Soo Xidhiidh'});
};
exports.feedbackPost = function(req, res, next){
    //process requst
    let msg = new Feedback({
        username: req.user,
        message: req.body.feedback,
        contact: req.body.contact,
    }).save(err => {
        if(err){
            return next(err);
        }
        res.redirect('/');
    });
    
};

//practice and questions

exports.baraaktiisSpace = function(req, res){
    async.parallel({
        questionsCount: function(callback) {
            Question.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        part: function(callback) {
            Question.find({}, 'question answer1 answer2 answer3 correct part', callback)
        },
    }, function(err, results) {
        res.render('baraaktiisSpace', {title:'U Diyaar Garow Imtaxaanka Bermitka Ohio', part1: results.part.filter(value => {return value.part == 1;}).length, progress:req.user.progress, User: req.user, questionsCount: results.questionsCount, part2: results.part.filter(value => {return value.part == 2;}).length, part3: results.part.filter(value => {return value.part == 3;}).length, part4: results.part.filter(value => {return value.part == 4;}).length, part5: results.part.filter(value => {return value.part == 5;}).length});
    });  
};

exports.practiceQuestion = function(req, res){
    //get an array of all the questions in the given part.
    var req = req;
    Question.find({}, 'question answer1 answer2 answer3 correct part').exec(
        function(err, questions){
            let part = questions.filter(value => {return value.part == parseInt(req.query.part);});
            //index keeps track of which question we're in, which is helpfull in the scripts of next/previous
            let index = 0;
            let choiceArray = [part[index].answer1, part[index].answer2, part[index].answer3, part[index].correct, part[index]._id]
            if(err){return next(err);}
            async.parallel({
                questionsCount: function(callback) {
                    Question.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
                },
                part: function(callback) {
                    Question.find({}, 'question answer1 answer2 answer3 correct part', callback)
                },
            }, function(err, results) {
                res.render('practiceQuestion1', {title:'suaalaha baraaktiiska qaybta '+part[index].part+" aad", length:questions.filter(value => {return value.part == parseInt(req.query.part);}).length, questionsCount: results.questionsCount, user: req.user, questions:part, part: req.query.part, index:index, choiceArray: choiceArray,  part1: results.part.filter(value => {return value.part == 1;}).length, progress:req.user.progress, User: req.user, questionsCount: results.questionsCount, part2: results.part.filter(value => {return value.part == 2;}).length, part3: results.part.filter(value => {return value.part == 3;}).length, part4: results.part.filter(value => {return value.part == 4;}).length, part5: results.part.filter(value => {return value.part == 5;}).length});
            });
            
        }
    );
};
exports.nextQuestion = function(req, res){
    var req = req;
    //get an array of all the questions in the given part.
    Question.find({}, 'question answer1 answer2 answer3 correct part').exec(
        function(err, questions){
            let part = questions.filter(value => {return value.part == parseInt(req.query.part);});
            //index keeps track of which question we're in, which is helpfull in the scripts of next/previous
            index = parseInt(req.query.index) + 1;
            let choiceArray = [part[index].answer1, part[index].answer2, part[index].answer3, part[index].correct, part[index]._id]
            if(err){return next(err);}
            //if the user answered correct increase the progress;
            let num = req.user.progress + 1;
            if(req.query.answeredCorrect == 'true'){
                let newUserData = {
                    username: req.user.username,
                    firstname: req.user.firstname,
                    lastname: req.user.lastname,
                    password: req.user.password,
                    progress: num,
                    _id: req.user.id
                }
                User.findByIdAndUpdate(req.user.id, newUserData, {}, function (err,thebook) {
                    
                    });

            }
            async.parallel({
                questionsCount: function(callback) {
                    Question.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
                },
                part: function(callback) {
                    Question.find({}, 'question answer1 answer2 answer3 correct part', callback)
                },
            }, function(err, results) {
                res.render('practiceQuestion1', {title:'suaalaha baraaktiiska qaybta '+part[index].part+" aad", length:questions.filter(value => {return value.part == parseInt(req.query.part);}).length, questionsCount: results.questionsCount, user: req.user, questions: results.part.filter(value => {return value.part == parseInt(req.query.part);}), part: req.query.part, index:index, choiceArray: choiceArray,  part1: results.part.filter(value => {return value.part == 1;}).length, progress:req.user.progress, User: req.user, questionsCount: results.questionsCount, part2: results.part.filter(value => {return value.part == 2;}).length, part3: results.part.filter(value => {return value.part == 3;}).length, part4: results.part.filter(value => {return value.part == 4;}).length, part5: results.part.filter(value => {return value.part == 5;}).length});
            });
            
        }
    );
    
};
exports.previousQuestion = function(req, res){
    var req = req
    var res = res;
    //get an array of all the questions in the given part.
    Question.find({}, 'question answer1 answer2 answer3 correct part').exec(
        function(err, questions){
            let part = questions.filter(value => {return value.part == parseInt(req.query.part);});
            //index keeps track of which question we're in, which is helpfull in the scripts of next/previous
          
            index = parseInt(req.query.index) - 1;
            let choiceArray = [questions[index].answer1, questions[index].answer2, questions[index].answer3, questions[index].correct, questions[index].id]
            if(err){return next(err);}
            res.render('practiceQuestion1', {title:'suaalaha baraaktiiska qaybta '+questions[0].part+" aad", part: questions[0].part, length:questions.filter(value => {return value.part == parseInt(req.query.part);}).length, user: req.user, questions: part, index:index, choiceArray: choiceArray,  part1: questions.filter(value => {return value.part == 1;}).length, part2: questions.filter(value => {return value.part == 2;}).length, part3: questions.filter(value => {return value.part == 3;}).length, part4: questions.filter(value => {return value.part == 4;}).length, progress:req.user.progress, User: req.user, questionsCount: part.questionsCount, questions: questions});
        }
    );
};

//finish previous version to be allowed the nextone
exports.partFinished =  function(req, res){
    var req = req;
    var res = res;
    //increment progress
    var num = parseInt(req.user.progress) + 2;
    var newUserData = new User (
        {username: req.user.username,
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        password: req.user.password,
        progress: num,
        _id: req.user.id
        }
    );
    User.findByIdAndUpdate(req.user.id, newUserData, {}, function (err,thebook) {
        if (err) { return next(err); }
        async.parallel({
            questionsCount: function(callback) {
                Question.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
            },
            part: function(callback) {
                Question.find({}, 'question answer1 answer2 answer3 correct part', callback)
            },
        }, function(err, results) {
            res.render('baraaktiisSpace', {title:'U Diyaar Garow Imtaxaanka Bermitka Ohio', part1: results.part.filter(value => {return value.part == 1;}).length, progress:req.user.progress, User: req.user, questionsCount: results.questionsCount, part2: results.part.filter(value => {return value.part == 2;}).length, part3: results.part.filter(value => {return value.part == 3;}).length, part4: results.part.filter(value => {return value.part == 4;}).length, part5: results.part.filter(value => {return value.part == 5;}).length});
        });  
        });
    
}
