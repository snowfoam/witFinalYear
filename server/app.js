var createError = require('http-errors');
var https = require('https');
var express = require('express');
var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var debug = require('debug')('myapp:server');
var helmet = require('helmet');
var connect = require('./database/connect')
var { normalizePort } = require('./shared/util')
var bootstrap = async () => {
  // connect mongodb database and init schemas
  await connect()

  var indexRouter = require('./routes/index');
  var teacherRouter = require('./routes/teacher');
  var studentRouter = require('./routes/student');

  var app = express();

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  app.use(helmet());
  app.use(logger('combined', { stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }) }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', indexRouter);
  app.use('/teacher', teacherRouter);
  app.use('/student', studentRouter);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  // var http = require('http');
  var https = require('https');

  // Get port from environment and store in Express.
  var port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);

  // Create HTTP server.
  // var server = http.createServer(app);
  var server = https.createServer({
    key: fs.readFileSync('./ssl/server.key', 'utf8'),
    cert: fs.readFileSync('./ssl/server.crt', 'utf8'),
    requestCert: false,
    rejectUnauthorized: false
  }, app);
  // Listen on provided port, on all network interfaces.
  server.listen(port);

  // Event listener for HTTP server "error" event.
  server.on('error', error => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  // Event listener for HTTP server "listening" event.
  server.on('listening', () => {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  });
}

// start the app
bootstrap()