import disconnect from './disconnect.js';
import truthOrDareSelected from './tord-selected.js';
import joinRoom from './join-room.js';
import startGame from './start-game.js';
import actionSelected from './action-selected.js';
import actionPerformed from './action-performed.js';
import scoreGiven from './score-given.js';
import nextRound from './next-round.js';
import endGame from './end-game.js';

const sockets = (io) => {
    io.on("connection", (socket) => {      
        socket.on('join-room', ({roomId, name, avatar}) => joinRoom(socket, {roomId, name, avatar}));

        socket.on('start-game', () => startGame(socket));

        socket.on('disconnect', () => disconnect(socket));

        socket.on('tord-selected', (truthOrDare) => truthOrDareSelected(socket, truthOrDare));

        socket.on('action-selected', (truthOrDareID) => actionSelected(socket, truthOrDareID));
    
        socket.on('action-performed', () => actionPerformed(socket));

        socket.on('action-score-given', (score) => scoreGiven(socket, score));

        socket.on('next-round', () => nextRound(socket));

        socket.on('end-game', () => endGame((socket)));
    })
}

export default sockets;