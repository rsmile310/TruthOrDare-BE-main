import Player from "../models/player.js";
import { v4 as uuidv4 } from 'uuid';
import { PLAYER_STATUS } from "../const.js";

const player = {}; 

player.getPlayerBySocketId=(socketId, roomId)=>{
    return new Promise((resolve, reject)=>{
        Player.query(function(qb) {
            qb.where({socketId: socketId});
            qb.where({roomId: roomId});
        })
        .fetchAll()
        .then(result=>{
            resolve(result.toJSON());
        }).catch(err=>{ 
            reject(err);
        }) 
    })
}

player.getPlayersinRoom=(roomId)=>{
    return new Promise ((resolve, reject) =>{
        Player.where({roomId: roomId})
        .fetchAll()
        .then(result=>{
            resolve(result.toJSON());
        })
        .catch(err =>{
            reject(err);
        })
    })
}

player.updateSocketId = (old_socketId, new_socketId) => {
    return new Promise((resolve, reject) =>{
        Player.where({socketId: old_socketId})
        .save(
            {socketId: new_socketId},
            {method: 'update', patch: true}
        ).then((result)=>{
            resolve(result);      
        })
        .catch(err =>{
            reject(err);
        })
    })
}

player.updateHasVoted = (socketId, hasVoted) =>{
    return new Promise((resolve, reject) =>{
        Player.where({socketId: socketId})
        .save(
            {hasVoted: hasVoted},
            {method: 'update', patch: true}
        ).then((result)=>{
            resolve(result);
        })
        .catch(err =>{
            reject(err);
        })
    })
}

player.updateHasPlayed = (socketId, hasVoted) =>{
    return new Promise((resolve, reject) =>{
        Player.where({socketId: socketId})
        .save(
            {hasPlayed: hasVoted},
            {method: 'update', patch: true}
        ).then((result)=>{
            resolve(result);
        })
        .catch(err =>{
            reject(err);
        })
    })
}
player.updateHasPlayedId = (socketId, hasVoted) =>{
    return new Promise((resolve, reject) =>{
        Player.where({id: socketId})
        .save(
            {hasPlayed: hasVoted},
            {method: 'update', patch: true}
        ).then((result)=>{
            resolve(result);
        })
        .catch(err =>{
            reject(err);
        })
    })
}
player.updateAllHasVoted = (roomId, hasVoted) => {
    return new Promise((resolve, reject) =>{
        Player.where({roomId: roomId})
        .save(
            {hasVoted: hasVoted},
            {method: 'update', patch: true}
        ).then((result)=>{
            resolve(result);
        })
        .catch(err =>{
            reject(err);
        })
    })
}
player.updateTruthScore = (socketId, roomId, score) =>{
    return new Promise((resolve, reject) =>{
        Player.query(function(qb) {
            qb.where({socketId: socketId}); 
            qb.where({roomId:roomId});
            qb.increment({truthScore: score});
        }).fetchAll()
        .then((result)=>{
           resolve(result);
        })
        .catch(err =>{
            reject(err);
        })
    })
}
player.updateDareScore = (socketId, roomId, score) =>{
    return new Promise((resolve, reject) =>{
        Player.query(function(qb) {
            qb.where({socketId: socketId}); 
            qb.where({roomId:roomId});
            qb.increment({dareScore: score});
        }).fetchAll()
        .then((result)=>{
           resolve(result);
        })
        .catch(err =>{
            reject(err);
        })
    })
}
player.insert = (p) => {
    return new Promise((resolve, reject) =>{
        var insertedId=uuidv4();
        
        Player.forge({id: insertedId, socketId: p.socketId, truthScore: p.truthScore, dareScore: p.dareScore, playerStatus: p.playerStatus,roomId: p.roomId, name: p.name, avatar: p.avatar })
        .save(null, {method: 'insert'})
        .then((result)=>{
            resolve(insertedId);
        })
        .catch(err =>{
            console.log("FAIL");
            console.log(err);
            /*
            Player.fetchAll()
            .then((result)=>{
                resolve(result);
                var resJSON = result.toJSON();

                do {
                    console.log("failed so generating a new one");
                    var duplicate =false;
                    insertedId=uuidv4();
                    resJSON.forEach(element => {
                        if(insertedId==element.id)
                            duplicate=true;
                    });
                } while (duplicate);
                
                console.log("generated unique so inserting again");
                Player.forge({id: insertedId, socketId: p.socketId, truthScore: p.truthScore, dareScore: p.dareScore, playerStatus: p.playerStatus,roomId: p.roomId })
                .save(null, {method: 'insert'})
                .then((result)=>{
                    resolve(insertedId);
                }).catch(err=>{
                    resolve("Forgein key constraint violated on roomID");
                    reject(err);
                });
                
            }) */
        });
         
    })
}

player.getNumPlayersInRoom = (roomId) => {
    return new Promise ((resolve, reject) =>{
        Player.where({roomId: roomId})
        .count('id')
        .then(result=>{
            resolve(result);
        })
        .catch(err =>{
            reject(err);
        })
    })
}
player.getPlayersHaventPlayed=(roomId)=>{
    return new Promise ((resolve, reject) =>{
        Player.query(function(qb) { 
            qb.where({hasPlayed: false});
            qb.where({roomId: roomId});
            qb.where({playerStatus: PLAYER_STATUS.READY});
        })
        .fetchAll()
        .then(result=>{
            resolve(result.toJSON());
        })
        .catch(err =>{
            reject(err);
        })
    })
}
player.deletePlayer = (playerId) => {
    return new Promise((resolve, reject) => {
        Player.where({'id': playerId})
        .destroy()
        .then((result, error) => {        
            resolve(result);
        })
        .catch(error => {
            reject(error);
        })
    })
}

player.deletePlayerByRoomId = (roomId) =>{
    return new Promise((resolve, reject) => {
        Player.where({roomId: roomId})
        .destroy()
        .then((result, error) => {        
            resolve(result);
        })
        .catch(error => {
            reject(error);
        })
    })
}

player.setPlayerStatus = (socketId, roomId, status) => {
    return new Promise((resolve, reject) =>{
        Player.query(function(qb) { 
            qb.where({socketId: socketId});
            qb.where({roomId: roomId});
        })
        .save(
            {playerStatus: status},
            {method: 'update', patch: true}
        ).then((result)=>{
           resolve(result.toJSON())
        })
        .catch(err =>{
            reject(err);
        })
    })
}

player.nullCurrentRoom = (roomId) => {
    return new Promise((resolve, reject) =>{
        Player.where({roomId: roomId})
        .save(
            {roomId: null},
            {method: 'update', patch: true}
        ).then((result)=>{
            resolve(result)
        })
        .catch(err =>{
            reject(err);
        })
    })
}

export default player;
