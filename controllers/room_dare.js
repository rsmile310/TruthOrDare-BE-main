import Room_Dare from "../models/room_dare.js";
import dare from "./dare.js";
import { v4 as uuidv4 } from 'uuid';

const room_dare = []

room_dare.getNumDaresInRoom = (roomId)=>{
    return new Promise((resolve, reject)=>{
        Room_Dare.where({roomId: roomId})
        .fetchAll()
        .then(result=>{
            var contents =Array.from(result.toJSON());
            var dares = [];
            var promises=[];
            for(let i =0; i <contents.length; i++){
               // dares[i] = dare.ge
               promises[i] = dare.getDareWithId(contents[i].dareId);    
            }

            Promise.all(promises)
            .then(result=>{
                resolve(result.length);
            })       
        })
        .catch(err=>{ 
            reject(err);
        }) 
    })
}
room_dare.getDareInPlayNotQuery=(roomId)=>{
    return new Promise((resolve, reject)=>{
        Room_Dare.where({roomId:roomId, isInPlay: true})
        .fetchAll()
        .then(result=>{
            resolve(Array.from(result.toJSON())[0]);
        })
        .catch("fail");
    })

}
room_dare.getDaresInRoom = (roomId) =>{
    return new Promise((resolve, reject)=>{
        Room_Dare.where({roomId: roomId})
        .fetchAll()
        .then(result=>{
            var contents =Array.from(result.toJSON());
            var dares = [];
            var promises=[];
            for(let i =0; i <contents.length; i++){
               // dares[i] = dare.ge
               promises[i] = dare.getDareWithId(contents[i].dareId);      
            }

            Promise.all(promises)
            .then(result=>{
                resolve(result);
            })    
        })
        .catch(err=>{ 
            reject(err);
        }) 
    })
}

room_dare.deleteSingle = (roomId, dareId)=>{
    return new Promise((resolve, reject) => {
        Room_Dare.where({roomId: roomId, dareId: dareId})
        .destroy({require: false})
        .then((result, error) => {        
            resolve(result);
        })
        .catch(error => {
            reject(error);
        })
    })
}
room_dare.insertMultiple = (roomId, dares) => {
    return new Promise((resolve, reject) =>{ 
        let ops = [];

        for(let i =0; i <dares.length; i++){
            ops.push(room_dare.insert(roomId, dares[i].id));
        }

        Promise.all(ops)
        .then((result)=>{    
            resolve(result);
        })
        .catch(err=>{
            reject(err);
        })  
    })
}

room_dare.insert = (roomId, dareId) => {
    return new Promise((resolve, reject) =>{ 
        var id = uuidv4();
        Room_Dare.forge({id: id, roomId: roomId, dareId: dareId })
        .save(null, {method: 'insert'})
        .then((result)=>{
            resolve(result);
        })
        .catch(err=>{
            resolve("Forgein key constraint violated on roomID");
            reject(err);
        }) 
    })
}

room_dare.getRandomDares = (roomId) => {
    return new Promise((resolve, reject) =>{
        Room_Dare
        .where({roomId: roomId})
        .count()
        .then(count => {
            Room_Dare.where({roomId: roomId})
            .query((qb) => {
                qb.offset(Math.floor(Math.random() * (count- 3)))
                qb.limit(3);
            }).fetchAll()
            .then((result)=>{
                let contents = Array.from(result.toJSON());

                let ops = [];
                
                for(let i =0; i <contents.length; i++){
                    ops.push(room_dare.updateDareVotable(contents[i].id, true));
                }
              
                Promise.all(ops).then(result=>{
                    ops = [];

                    for(let i =0; i <contents.length; i++){
                        ops.push(dare.getById(contents[i].dareId));
                    }

                    Promise.all(ops)
                    .then(result=>{
                        resolve(result);
                    })
                })
            })
            .catch(err=>{
                reject(err);
            })
        })
        .catch(err =>{
            reject(err);
        })
    })      
}

room_dare.voteForDare = (roomId, dareId) =>{
    return new Promise((resolve, reject) =>{
        Room_Dare.query(function(qb) {
            qb.where({roomId: roomId});
            qb.where({dareId: dareId});
            qb.increment({numberOfVotes: 1});
        }).fetchAll()
        .then((result)=>{
           resolve(result);
        })
        .catch(err =>{
            reject(err);
        })
    })
}

room_dare.updateDareVotable = (id, votable) => {
    return new Promise((resolve, reject) =>{
        Room_Dare.where({id: id})
        .save(
            {isVotable: votable},
            {method: 'update', patch: true}
        )
        .then((result)=>{
           resolve(result);
        })
        .catch(err =>{
            reject(err);
        })
    })
}

room_dare.updateisInPlay = (roomId, dareId, isInPlay)=>{
    return new Promise((resolve, reject) =>{
        Room_Dare.query(function(qb) {
            qb.where({roomId: roomId});
            qb.where({dareId: dareId});
        })
        .save(
            {isInPlay: isInPlay},
            {method: 'update', patch: true}
        )
        .then((result)=>{
           resolve(result);
        })
        .catch(err =>{
            reject(err);
        })
    })
}

room_dare.updateRoomVoting = (roomId, votable) => {
    return new Promise((resolve, reject) =>{
        Room_Dare.where({roomId: roomId})
        .save(
            {isVotable: votable},
            {method: 'update', patch: true}
        )
        .then((result)=>{
           resolve(result);
        })
        .catch(err =>{
            reject(err);
        })
    })
}

room_dare.getWinningDare = (roomId) => {
    return new Promise((resolve, reject) =>{
        Room_Dare.where({roomId: roomId})
        .query(function(qb){
            qb.orderBy('numberOfVotes', 'DESC');
            qb.limit(1);
        }).fetchAll()
        .then((result)=>{
           resolve(result.toJSON());
        })
        .catch(err =>{
            reject(err);
        })
    })
}

room_dare.deleteRoom = (roomId) => {
    return new Promise((resolve, reject) => {
        Room_Dare.where({'roomId': roomId})
        .destroy({require: false})
        .then((result, error) => {        
            resolve(result.toJSON());
        })
        .catch(error => {
            reject(error);
        })
    })
}

room_dare.getVotableDares = (roomId) => {
    return new Promise((resolve, reject) => {
        Room_Dare.query(function(qb) {
            qb.where({roomId: roomId});
            qb.where({isVotable: true});
        }).fetchAll()
        .then((result)=>{
            result = result.toJSON()
            let ops = [];

            for(let i =0; i <result.length; i++){
                ops.push(dare.getById(result[i].dareId));
            }
    
            Promise.all(ops)
            .then(result=>{
                resolve(result);
            })
            .catch(err =>{
                reject(err);
            })
        })
        .catch(err =>{
            reject(err);
        })
    })
}

room_dare.getDareInPlay = (roomId) => {
    return new Promise((resolve, reject) => {
        Room_Dare.query(function(qb) {
            qb.where({roomId: roomId});
            qb.where({isInPlay: true});
            qb.limit(1);
        }).fetch()
        .then((result)=>{
            result = result.toJSON()
            console.log(result);
            Promise.resolve(
                dare.getById(result.dareId)
            )
            .then((result)=>{
                resolve(result);
            })
            .catch(err =>{
              //  reject(err);
            })
        })
        .catch(err =>{
          //  reject(err);
        })
    })
}

export default room_dare;