var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var paginate = require('express-paginate');
var winston = require('./config/winston');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
// var loginRouter = require('./routes/login');
// var registroRouter = require('./routes/registro');
var notFoundRouter = require('./routes/notFound');

var app = express();

//uso de middleware
app.use(paginate.middleware(2,20));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

var hbs = require('hbs');
hbs.registerPartials(`${__dirname}/views/partials`);
var hbsUtils = require('hbs-utils')(hbs);
hbsUtils.registerWatchedPartials(`${__dirname}/views/partials`);
require('./helpers/hbs')(hbs);

app.use(session({
    secret: 'clavesecreta',
    name: 'cookiedemiapp',
    resave: true,
    saveUninitialized: true
}));


// app.use(logger('dev'));
//app.use(logger('combined', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/components', express.static(`${__dirname}/public/components`));

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/*', notFoundRouter);

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

module.exports = app;
