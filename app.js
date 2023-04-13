const PORT = 1111;

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

// let users = [];

const userMap = new Map();


const defaultRoom = 'koooom';

function User({ID, name}){
  if(!(ID && name)) return;
  this.ID = ID;
  this.name = name;
}

io.on('connection', (socket) =>{

  console.log('client connected. ', socket.id);
  socket.join(defaultRoom);

  const newUser = new User({ID: socket.id, name: socket.handshake.query.name});

  userMap.set(socket.id, newUser);

  socket.emit('init', [...userMap].map( ([ID, info]) => info ));
  socket.broadcast.to(defaultRoom).emit('user_join', newUser)

  //client msg receive
  socket.on('chat', (msg) => {
    const {text, userName} = msg;
    console.log('chat recv: ', msg);
    if(text && userName){
      socket.broadcast.to(defaultRoom).emit('other_msg', msg);
      socket.emit('chat_response', msg);

    }else{

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
    userMap.delete(socket.id);
    socket.broadcast.to(defaultRoom).emit('user_out', socket.id)
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
