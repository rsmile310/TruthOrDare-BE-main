import room from '../controllers/room.js';
import player from '../controllers/player.js';
import room_truth from '../controllers/room_truth.js';
import room_dare from '../controllers/room_dare.js';
import {timers, Timer, setTimer} from '../objects/timer.js'
import { PLAYER_STATUS } from '../const.js';
import io from '../app.js';

const disconnect = (socket) => {
    console.log("disconnect");
    let socketId = socket.id;
    let roomId = socket.roomId;

    Promise.all([
        player.setPlayerStatus(socketId, roomId, PLAYER_STATUS.DISCONNECTED),
        room.getById(roomId)
    ])
    .then(res => {
        let disconnectedPlayer = res[0];
        let currentRoom = res[1];

        Promise.all([
            player.getPlayersinRoom(roomId)
        ])
        .then(res => {
            let players = res[0];

            let allDisconnected = players.every(function(player) {
                let disconnected = player.playerStatus == PLAYER_STATUS.DISCONNECTED;
                return disconnected;
            });

            console.log(allDisconnected);

            // If all players in room are disconnected then we can continue to delete everything
            if(allDisconnected){
                //We need to make the host (and currentPlayer) null for the foregign key violation.
                Promise.all([
                    room.nullCurrentPlayer(roomId),
                    room.nullHostPlayer(roomId),
                    room_dare.deleteRoom(roomId),
                    room_truth.deleteRoom(roomId)
                ])
                .then(res => {
                    Promise.resolve(
                        player.deletePlayerByRoomId(roomId),
                    )
                    .then(res => {
                        // delete the room after players to satisfy foreign key violation  
                        Promise.resolve(
                            room.deleteRoom(roomId)
                        )
                        .then(res => {
                            // remove any timers
                            if(timers[roomId] != null){
                                timers[roomId] = null;                 
                            }
                            console.log('room deleted');
                        })   
                    })        
                })
            }else{
                // If host, give to someone else
                if(disconnectedPlayer.id == currentRoom.ownerId){

                    let nextHost = {}           
                    for(let player of players){
                        if(player.playerStatus != PLAYER_STATUS.DISCONNECTED){
                            nextHost = player;
                            break;
                        }
                    }

                    // Maybe do something with currentPlayer but not yet

                    Promise.resolve(
                        room.updateHostPlayer(roomId, nextHost.id)
                    )
                    .then(res => {
                        console.log('host updated');
                        console.log(res);
                        io.in(roomId).emit('room-updated', res);  
                    })
                }
            }

            io.in(roomId).emit('players-updated', players);  
        })
    })
    .catch(err => {
        console.log('user not in room');
    })

    /*
    Promise.resolve(player.getPlayerBySocketId(socketId))
    .then(res_playerId=>{ 
        //console.log("res from socket is ")
        //console.log(res_playerId)

        if(res_playerId[0] == undefined){
            // user hasnt connected to anything
            return;
        }

        var playerId= res_playerId[0].id;
        var roomId= res_playerId[0].roomId;
         
        //console.log("vars are" + playerId + " a " + roomId)
        
        //Get rooms in which this player is a current player or a host (aka foreign key violation)
        Promise.all([room.getRoomsWithCurrentPlayer(playerId), room.getRoomsWithPlayerAsHost(playerId)])
        .then(playerRooms=>{ 
            //console.log(playerRooms[1].length, playerRooms[0].length)

            //if the player isn't current player or host in any room we can delete them.
            //a thought.. if they're not current player or host in any room, then that room defo has other people in it
            //so no need to delete the room
            if(playerRooms[1].length == 0 && playerRooms[0].length==0){
                //console.log("player isn't host or curr player");
                //Delete the player
                Promise.resolve(player.deletePlayer(playerId))
                .then(resss=>{
                    console.log("player deleted");

                        //Now player is deleted, check if room is empty
                        //Thought...this is probably redundant as the room is probably not empty
                        //because the user would have been the host if so
                        Promise.resolve(room.getNumPlayersInRoom)
                        .then(numPinRoom=>{

                            //If empty, we can get rid of it.
                            if(numPinRoom==0){
                                 //#region deleteRoomRegion
                                 Promise.all([room_dare.getNumDaresInRoom(roomId), room_truth.getTruthsInRoom(roomId)])
                                .then(countTruthsDares=>{
                                    if(countTruthsDares[0]>=1){
                                        Promise.resolve(room_dare.deleteRoom(roomId))
                                        .then(roomDareDel=>{
                                            console.log("room dare deleted");
                                        })
                                    }

                                    if(countTruthsDares[1]>=1){
                                        Promise.resolve(room_truth.deleteRoom(roomId))
                                        .then(roomTruthDel=>{
                                            console.log("room truth deleted");
                                        })
                                    }
                                    console.log("deleting the room now with " + roomId)
                                    Promise.resolve(room.deleteRoom(roomId))
                                })
                                 //#endregion
                            }
                        })
                        
            })
            
            }
            
            //console.log(playerRooms[1])
            //For each room that this player is a host (most likely only 1 room)
            playerRooms[1].forEach(roomRes => {
                console.log("player is a host in the room")
                
                //For each room that the player is a host in, we need to check how many other players are in that room
                //so we can assign a new host or if there aren't any, we can delete the room
                Promise.all([
                    room.getNumPlayersInRoom(roomRes.id), 
                    room.getPlayersInRoom(roomRes.id)
                ])
                .then (numPlayers_res=>{
                    //console.log("num players is " + numPlayers_res[0])
                    
                    //if there are other players in the room, we need to set a new host player
                    if(numPlayers_res[0]>1){
                        //console.log(numPlayers_res[1][0]);

                        //set the next player as the host
                        Promise.resolve(room.updateHostPlayer(roomRes.id,numPlayers_res[1][1].id))
                        .then(updateHost=>{
                        
                        //Now check if the player isn't current player somewhere else, they are safe to delete
                        if(playerRooms[0].length==0){
                            Promise.resolve(player.deletePlayer(playerId))
                            .then(finished=>{

                            })
                        }

                        })
                    }
                    else
                    {

                        //This player is the only player and they are the host, we need to make the host null
                        //for the foregign key violation
                        Promise.resolve(room.nullHostPlayer(roomRes.id))
                        .then(NullRes=>{
                            console.log("deletign player noww");
                            //once nulled, we can delete the player
                            if(playerRooms[0].length==0){
                            Promise.resolve(player.deletePlayer(playerId))
                            .then(ress=>{
                                //player is gone and they were the only player so the room is ready to delete too.
                                //#region deleteRoomRegion
                                Promise.all([room_dare.getNumDaresInRoom(roomRes.id), room_truth.getTruthsInRoom(roomRes.id)])
                                .then(countTruthsDares=>{
                                    if(countTruthsDares[0]>=1){
                                        Promise.resolve(room_dare.deleteRoom(roomRes.id))
                                        .then(roomDareDel=>{
                                            //console.log("room dare deleted");
                                        })
                                    }

                                    if(countTruthsDares[1]>=1){
                                        Promise.resolve(room_truth.deleteRoom(roomRes.id))
                                        .then(roomTruthDel=>{
                                            //console.log("room truth deleted");
                                        })
                                    }
                                    console.log("deleting the room now with " + roomRes.id)
                                    Promise.resolve(room.deleteRoom(roomRes.id))
                                })
                                //#endregion
                                    
                                
                            });
                        }
                        })
                    }
                })
                
            });

            //For each room that this player is a current player (most likely only 1 room)
            playerRooms[0].forEach(roomRes => {
                console.log(roomRes.id)
                
                Promise.all([room.getNumPlayersInRoom(roomRes.id), room.getPlayersInRoom(roomRes.id)])
                .then (numPlayers_res=>{
                    console.log("num players is " + numPlayers_res[0])
                    if(numPlayers_res[0]>1){
                        console.log(numPlayers_res[1][0]);
                        Promise.resolve(room.room.updateCurrentPlayer(roomRes.id,numPlayers_res[1][1].id))
                        .then(updateCurrPlayer=>{
                        Promise.resolve(player.deletePlayer(playerId))
                        .then(finished=>{

                        })
                        })
                    }else{
                        //this is the only player in that room left we need to null
                        Promise.resolve(room.nullCurrentPlayer(roomRes.id))
                        .then(NullRes=>{
                            Promise.resolve(player.deletePlayer(playerId))
                            .then(ress=>{
                                //player is gone and they were the only player so the room is ready to delete too.
                                //#region deleteRoomRegion
                                console.log("deleting room dare and truth");
                                
                                Promise.all([room_dare.getNumDaresInRoom(roomRes.id), room_truth.getTruthsInRoom(roomRes.id)])
                                .then(countTruthsDares=>{
                                    if(countTruthsDares[0]>=1){
                                        Promise.resolve(room_dare.deleteRoom(roomRes.id))
                                        .then(roomDareDel=>{
                                            console.log("room dare deleted");
                                        })
                                    }

                                    if(countTruthsDares[1]>=1){
                                        Promise.resolve(room_truth.deleteRoom(roomRes.id))
                                        .then(roomTruthDel=>{
                                            console.log("room truth deleted");
                                        })
                                    }

                                    console.log("deleting the room now with " + roomRes.id)
                                    Promise.resolve(room.deleteRoom(roomRes.id))
                                })
                            });
                            //#endregion
                        })
                    }
                })      
            });
        })
    })
    */
}

export default disconnect;