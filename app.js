const PORT = 3000;

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) =>{

  console.log('client connected. ', socket.id);

  socket.emit('init', socket.id);

  //client msg receive
  socket.on('chat', (msg) => {
    console.log('chat recv: ', msg);
    const {text, roomID} = msg;
    if(roomID){
      socket.broadcast.to(roomID).emit('other_msg', text);
      socket.emit('chat_response', text);
    }else{
      socket.emit('chat_response', '방에 들어가세요.');
    }
    //receive success response
    //broad cast msg
  })

  socket.on('enter-room', (msg) => {
    console.log(`enter-room: `, msg);
    socket.join(msg);

    socket.emit('enter-room-confirm', msg);
  })

  socket.on("disconnect", (reason) => {
    console.log('socket disconnect: ', socket.id, reason);
  });
})

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const testRouter = require('./routes/test')


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/test', testRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// // error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(PORT);


module.exports = app;
