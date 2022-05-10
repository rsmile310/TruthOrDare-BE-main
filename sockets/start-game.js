import room from '../controllers/room.js'
import player from '../controllers/player.js'
import room_truth from '../controllers/room_truth.js'
import room_dare from '../controllers/room_dare.js'
import dare from '../controllers/dare.js'
import truth from '../controllers/truth.js'
import { GAME_STATUS, LOBBY_STATUS } from '../const.js'
import {timers, Timer, setTimer} from '../objects/timer.js'
import io from '../app.js';

const startGame = (socket) => {
    let roomId = socket.roomId;
    let nTruths = 6;
    let nDares = 6;

    // assign random current player
    Promise.all([
        player.getPlayersinRoom(roomId), 
        player.getNumPlayersInRoom(roomId)
    ])
    .then(result=>{

        var rand = Math.floor(Math.random() * result[1]);
        var players=result[0];
        
        //assign random player in room as current player, get random dares
        Promise.all([
            room.updateCurrentPlayer(roomId, players[rand].id), 
            dare.getNRandomDares(result[1] * nDares), 
            truth.getNRandomTruths(result[1] * nTruths)
        ])
        .then(res=>{
            Promise.all([
                room_dare.insertMultiple(roomId, res[1]), 
                room_truth.insertMultiple(roomId, res[2])
            ])
            .then (res=>{
                Promise.all([
                    room.updateGameStatus(socket.roomId, GAME_STATUS.CHOOSING_PLAYER),
                    room.updateLobbyStatus(socket.roomId, LOBBY_STATUS.GAME)
                ])
                .then(res => {
                    io.in(socket.roomId).emit('room-updated', res[1]);
    
                    // start a new timer
                    let timer = new Timer()
                    timers[socket.roomId] = timer;
                    setTimer(timer, socket.roomId, 11, io, () => {
                        timers[socket.roomId] = {};
    
                        Promise.all([
                            room.updateGameStatus(socket.roomId, GAME_STATUS.CHOOSING_TORD)
                        ])
                        .then(res => {
                            io.in(socket.roomId).emit('room-updated', res[0]);
                        })
                    })
                });
            })
        })
        .catch(err=>{
            console.log("Error")
        })
    })
}

export default startGame;