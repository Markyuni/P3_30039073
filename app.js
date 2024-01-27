var cookieParser = require('cookie-parser');
var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var path = require('path');
var dotenv = require('dotenv').config()

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', true);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

app.post("/post", async (req, res) => {
  const name = req.body.name;
  const response_key = req.body["g-recaptcha-response"];
  const secret_key = process.env.PRIVATE_KEY;
  const options = {
    url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.PRIVATE_KEY}&response=${response_key}`,
    headers: { "Content-Type": "application/x-www-form-urlencoded", 'json': true }
  }
});

module.exports = app;
