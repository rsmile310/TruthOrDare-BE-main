import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import router from './routes/api.js';
import expressSession from 'express-session';
import sharedsession from 'express-socket.io-session';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from "socket.io";
import sockets from './sockets/socket.js';

var app = express();
app.use(cors({credentials: true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var session = expressSession({
    saveUninitialized: true,
    secret: 'my-secret',
    resave: true,
    proxy: true,
    cookie: {
      secure: false,
      // 1 hour
      maxAge: 3600000
    },
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
    next();
});

var port = normalizePort(process.env.PORT || '8001');
app.set('port', port);

var server = http.createServer(app);

// Socket IO setup
const io = new Server(server, {
    cors: {
        origin: '*',
        credentials: true
    },
});

io.engine.on('initial_headers', (headers, req) => {
    headers['Access-Control-Allow-Origin'] = req.headers.origin;
    headers['Access-Control-Allow-Credentials'] = true;
});

io.engine.on('headers', (headers, req) => {
    headers['Access-Control-Allow-Origin'] =  req.headers.origin;
    headers['Access-Control-Allow-Credentials'] = true;
});

io.use(sharedsession(session, cookieParser(), {autoSave: true}));

// Setup socket connections
sockets(io);

function normalizePort(val) {
var port = parseInt(val, 10);

if (isNaN(port)) {
    // named pipe
    return val;
}

if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
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
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}

app.use(session);
app.use(cookieParser());
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
app.use('/', router);

export default io;