import player from "../controllers/player.js";
import room from "../controllers/room.js";
import { GAME_STATUS } from "../const.js";
import io from '../app.js';

import {timers, Timer, setTimer} from '../objects/timer.js';

const nextRound = (socket) => {
    console.log('next round');
    //Choose the next player to be current player
    Promise.resolve(player.getPlayersHaventPlayed(socket.roomId))
    .then(players=>{
        console.log("players not pl")
        console.log(players)
        Promise.resolve(room.updateCurrentPlayer(socket.roomId, players[0].id))
        .then(updatedPlayerInRoom=>{
            Promise.resolve(room.updateGameStatus(socket.roomId, GAME_STATUS.CHOOSING_PLAYER))
            .then(updateRoomStatus=>{
                io.in(socket.roomId).emit('room-updated', updateRoomStatus);
    
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
            })
        })
    })
    //Will want to select a random player: where !hasPlayed and userStatus == PLAYER_STATUS.READY
    //Update room with this new currentPlayer room.updateCurrentPlayer


    //Update room status 
    //room.updateGameStatus(socket.roomId, GAME_STATUS.CHOOSING_PLAYER)


    // Copy lines 43-57 in start-game.js (updating room and countdown)
}

export default nextRound;