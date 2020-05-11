var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
var fs = require('fs');

var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;


//acquire routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//setup the database conenction
const mongoDb = "mongodb+srv://ZYusuf10:Suppot2020!32@cluster0-urosg.azure.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//serve javascript
//router.get('/public/javascripts/next.js', userAction.next)
//javascript
app.use(express.static('public'))

app.listen(80, function () {
  console.log('app listening on port ' + 80 + '!');
});


module.exports = app;