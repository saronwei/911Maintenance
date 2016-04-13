var express = require('express');
var path = require('path');
var http = require('http');
var domain = require('domain');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var moduleManager = require('./framework/module/module.manage')();

var app = express();
moduleManager.Build(app, path.join(__dirname, '/server/modules/'));

// view engine setup
app.set('views', path.join(__dirname, 'server', 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// error handlers
function errorHandle(err, req, res, next) {
    res.status(err.status || 500);
    res.write(err.message);
    res.end();
}

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(errorHandle);
}

// production error handler
// no stack traces leaked to user
app.use(errorHandle);


module.exports = app;
