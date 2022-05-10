import room from '../controllers/room.js';
import player from '../controllers/player.js';
import room_truth from '../controllers/room_truth.js';
import room_dare from '../controllers/room_dare.js';
import truth from '../controllers/truth.js';
import dare from '../controllers/dare.js';
import {timers, Timer, setTimer} from '../objects/timer.js'
import { GAME_STATUS } from '../const.js';
import io from '../app.js';

const scoreGiven = (socket, score) => {
    // Update user has gicen score
    let ops=[];
        
        // update the player has voted
    ops.push(player.updateHasVoted(socket.id, true));

    // Update truth/dare score
    ops.push(room.getById(socket.roomId));
    console.log("updating has voted and getting room by id");
    Promise.all(ops)
    .then (result=>{
        console.log(socket.roomId);
         
        let ops2=[];
        if(result[1].truthOrDare=='truth')
            ops2.push(player.updateTruthScore(socket.id,socket.roomId,score));
            else
            ops2.push(player.updateDareScore(socket.id,socket.roomId,score));

            Promise.all(ops2)
            .then(votedResult=>{
                Promise.all([room.getPlayersInRoom(socket.roomId), room.getById(socket.roomId)])
            
            .then(resultGetPlayersInRoom=>{

                var everyoneVoted=true;
                resultGetPlayersInRoom[0].forEach(playerr => {
                    console.log("Checking")
                    console.log(playerr)
                    console.log("currplayer id is " + resultGetPlayersInRoom[1].currentPlayerId)
                    if(playerr.hasVoted==false && playerr.id != resultGetPlayersInRoom[1].currentPlayerId)
                    everyoneVoted=false;
                })

                // if all voted (but not currentPlayer) then pick action with highest
                if(everyoneVoted){
                    Promise.resolve(room.getById(socket.roomId))
                    .then(gottenRoom=>{
                    Promise.resolve(player.updateHasPlayedId(gottenRoom.currentPlayerId, true))
                    .then(updateHasPlayed=>{
                        Promise.all([player.updateAllHasVoted(socket.roomId, false), room.updateGameStatus(socket.roomId, GAME_STATUS.ROUND_END)])
                        .then(updateAllHasVotedandStatus=>{
                            let ops = [];
                            ops.push(room.getById(socket.roomId));
                            ops.push(player.getPlayersinRoom(socket.roomId));
                            

                            Promise.all(ops)
                            .then(result=>{
                            io.in(socket.roomId).emit('room-updated', result[0]); 
                            io.in(socket.roomId).emit('players-updated', result[1]);
                        })
                          
                        })
                    })
                })
                }
                else{
                    console.log("not everyone has voted but we done");
                }
                
            })
        })
    })
    // When all users have given score then
        // update user has played
        // false all hasVoted
        // Update game status (round end)
 
}


export default scoreGiven;