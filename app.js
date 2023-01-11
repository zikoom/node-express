const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();

//소켓 서버
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials :true,
    allowedHeaders: ["my-custom-header"],
    methods: ["GET", "POST", "OPTION"],
  }
});

io.on('connection', (socket) =>{
  console.log('client connected');
})

const SOCKET_PORT = 1313;
httpServer.listen(SOCKET_PORT, () => {console.log('listin: ', SOCKET_PORT)})


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const testRouter = require('./routes/test')





// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
// app.use(cors());
// app.use(cors());
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/test', testRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});









module.exports = app;
