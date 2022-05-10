import Room from "../models/room.js";
import Player from "../models/player.js";
import { hri } from "human-readable-ids";
import {LOBBY_STATUS, GAME_STATUS} from '../const.js'

const room = {};

room.getNumPlayersInRoom = (roomId) => {
    return new Promise ((resolve, reject) =>{
        Player.where({roomId: roomId})
        .fetchAll()
        .then(result=>{
            resolve(Array.from(result.toJSON()).length);
        })
        .catch(err =>{
            reject(err);
        })
    })
}

room.getPlayersInRoom = (roomId)=>{
    return new Promise ((resolve, reject) =>{
        Player.where({roomId: roomId})
        .fetchAll()
        .then(result=>{
            resolve(Array.from(result.toJSON()));
        })
        .catch(err =>{
            reject(err);
        })
    })
}

room.getAllRooms = () => {
    return new Promise((resolve, reject) => {
        Room.fetchAll()
        .then((result) => {
            resolve(result);
            console.log(result.toJSON());
        })
        .catch(err =>{
            reject(err);
        })
    })
}

room.updateHostPlayer = (roomId, hostId) =>{
    return new Promise((resolve, reject) =>{
        Room.where({id: roomId})
        .save(
            {ownerId: hostId},
            {method: 'update', patch: true}
        ).then((result)=>{
            resolve(result.toJSON());
        })
        .catch(err =>{
            reject(err);
        })
    })
}

room.updateCurrentPlayer = (roomId, currentPlayerId)=>{
    return new Promise((resolve, reject) =>{
        Room.where({id: roomId})
        .save(
            {currentPlayerId: currentPlayerId},
            {method: 'update', patch: true}
        ).then((result)=>{
            resolve(result);
        })
        .catch(err =>{
            reject(err);
        })
    })
}

room.nullCurrentPlayer = (roomId)=>{
    return new Promise((resolve, reject) =>{
        Room.where({id: roomId})
        .save(
            {currentPlayerId: null},
            {method: 'update', patch: true}
        ).then((result)=>{
            resolve(result);
        })
        .catch(err =>{
            reject(err);
        })
    
    })
}

room.nullHostPlayer = (roomId)=>{
    return new Promise((resolve, reject) =>{
        Room.where({id: roomId})
        .save(
            {ownerId: null},
            {method: 'update', patch: true}
        ).then((result)=>{
            resolve(result);
        })
        .catch(err =>{
            reject(err);
        })
    
    })
}

room.getRoomsWithPlayerAsHost = (playerId)=>{
    return new Promise ((resolve, reject) =>{
        Room.where({ownerId: playerId})
        .fetchAll()
        .then(result=>{
            resolve(Array.from(result.toJSON()));
        })
        .catch(err =>{
            reject(err);
        })
    })

}
room.getRoomsWithCurrentPlayer = (playerId)=>{
    return new Promise ((resolve, reject) =>{
        Room.where({currentPlayerId: playerId})
        .fetchAll()
        .then(result=>{
            resolve(Array.from(result.toJSON()));
        })
        .catch(err =>{
            reject(err);
        })
    })

}
room.getById = (roomId) => {
    return new Promise((resolve, reject)=>{
        Room.where({id: roomId})
        .fetch()
        .then(result=>{
            resolve(result.toJSON());
        })
        .catch(err=>{ 
            reject(err);
        }) 
    })
} 

room.insert = () => {
    return new Promise((resolve, reject) =>{
        var insertedId=hri.random()
        Room.forge({id: insertedId, lobbyStatus: LOBBY_STATUS.LOBBY, gameStatus: GAME_STATUS.CHOOSING_PLAYER})
        .save(null, {method: 'insert'})
        .then((result)=>{
            resolve(insertedId);
        })
        .catch(err =>{
            Room.fetchAll()
            .then((result)=>{
                resolve(result);
                var resJSON = result.toJSON();

                do {
                    console.log("failed so generating a new one");
                    var duplicate =false;
                    insertedId=hri.random();
                    resJSON.forEach(element => {
                        if(insertedId==element.id)
                            duplicate=true;
                    });
                } while (duplicate);
                
                console.log("generated unique so inserting again");
                Room.forge({id: insertedId  /* insertedId*/ }).save(null, {method: 'insert'})
                .then((result)=>{
                    resolve(insertedId);
                })
                .catch(err =>{
                    reject(err);
                });
            })
            .catch(err =>{
                reject(err);
            })
        });
    })
}

room.deleteRoom = (roomId) => {
    return new Promise((resolve, reject) => {
        Room.where({id: roomId})
        .destroy()
        .then((result, error) => {        
            resolve(result);
        })
        .catch(error => {
            reject(error);
        })
    })
}

room.updateLobbyStatus = (roomId, status) => {
    return new Promise((resolve, reject) => {
        Room.where({id: roomId})
        .save({lobbyStatus: status}, {patch: true})
        .then(result=>{
            resolve(result);
        }).catch(err=>{ 
            reject(err);
        }) 
    })
}

room.updateGameStatus = (roomId, status) => {
    return new Promise((resolve, reject) => {
        Room.where({id: roomId})
        .save({gameStatus: status}, {patch: true})
        .then(result=>{
            resolve(result);
        }).catch(err=>{ 
            reject(err);
        }) 
    })
}

room.updateTruthOrDare = (roomId, truthOrDare) => {
    return new Promise((resolve, reject) => {
        Room.where({id: roomId})
        .save({truthOrDare: truthOrDare}, {patch: true})
        .then(result=>{
            resolve(result);
        }).catch(err=>{ 
            reject(err);
        }) 
    })
}

export default room;