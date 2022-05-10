import room from '../controllers/room.js';
import player from '../controllers/player.js';
import room_truth from '../controllers/room_truth.js';
import room_dare from '../controllers/room_dare.js';
import truth from '../controllers/truth.js';
import dare from '../controllers/dare.js';
import {timers, Timer, setTimer} from '../objects/timer.js'
import { GAME_STATUS } from '../const.js';
import io from '../app.js';

const actionSelected = (socket, truthOrDareID) => {
    Promise.resolve(room.getById(socket.roomId))
    .then(r=>{
        let truthOrDare= r.truthOrDare;
        let ops=[];
        
        // update the player has voted
        ops.push(player.updateHasVoted(socket.id, true));
        
        // update what they have voted for 
        if(truthOrDare == 'truth')
            ops.push(room_truth.voteForTruth(socket.roomId, truthOrDareID));
        else
            ops.push(room_dare.voteForDare(socket.roomId, truthOrDareID));

        Promise.all(ops)
        .then(res=>{
            Promise.all([
                room.getById(socket.roomId), 
                room.getPlayersInRoom(socket.roomId)
            ])
            .then(result=>{ 
                console.log("now")
                var everyoneVoted=true;
                Array.from(result[1]).forEach(playerr => {
                    console.log(playerr)
                    if(playerr.hasVoted==false && playerr.id != result[0].currentPlayerId)
                    everyoneVoted=false;
                });

                // if all voted (but not currentPlayer) then pick action with highest
                if(everyoneVoted){
                    // cancel the timer
                    if(timers[socket.roomId] != null){
                        timers[socket.roomId].clear();
                        timers[socket.roomId] = null;
                    }
                    
                    let ops=[];
                    if(truthOrDare == 'truth')
                        ops.push(room_truth.getWinningTruth(socket.roomId));
                    else
                        ops.push(room_dare.getWinningDare(socket.roomId));

                    Promise.all(ops)
                    .then(res=>{
                        let winningTruthOrDare = res[0][0];

                        // update room_truth/dare with isVotable false, winner isInPlay true
                        let ops = [];
                        ops.push(room_truth.updateRoomVoting(socket.roomId, false))
                        ops.push(room_dare.updateRoomVoting(socket.roomId, false))

                        if(truthOrDare == 'truth'){
                            ops.push(room_truth.updateisInPlay(socket.roomId, winningTruthOrDare.truthId, true));
                            ops.push(truth.getById(winningTruthOrDare.truthId));
                        } 
                        else{
                            ops.push(room_dare.updateisInPlay(socket.roomId, winningTruthOrDare.dareId, true));
                            ops.push(dare.getById(winningTruthOrDare.dareId));
                        }
                            
                        ops.push(room.updateGameStatus(socket.roomId, GAME_STATUS.PERFORMING_ACTION));
                        ops.push(player.updateAllHasVoted(socket.roomId, false));

                        Promise.all(ops)
                        .then(res=>{
                            io.in(socket.roomId).emit('action-reveal', res[3]);
                            io.in(socket.roomId).emit('room-updated', res[4]);
                        })
                    })
                }
            })
        })
    })
}

export default actionSelected;