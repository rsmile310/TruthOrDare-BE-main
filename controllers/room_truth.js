import Room_Truth from "../models/room_truth.js";
import truth from "./truth.js";
import { v4 as uuidv4 } from 'uuid';

const room_truth = []

room_truth.getTruthsInRoom = (roomId) =>{
    return new Promise((resolve, reject)=>{
        Room_Truth.where({roomId: roomId})
        .fetchAll()
        .then(result=>{
            var contents =Array.from(result.toJSON());
            var truths = [];
            var promises=[];
            for(let i =0; i <contents.length; i++){
               // truths[i] = truth.ge
               promises[i] = truth.getTruthWithId(contents[i].truthId);          
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

 room_truth.voteForTruth = (roomId, truthId) =>{
    return new Promise((resolve, reject) =>{
        Room_Truth.query(function(qb) {
            qb.where({roomId: roomId});
            qb.where({truthId: truthId});
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

room_truth.getTruthsInRoom = (roomId) =>{
    return new Promise((resolve, reject)=>{
        Room_Truth.where({roomId: roomId})
        .fetchAll()
        .then(result=>{
            var contents =Array.from(result.toJSON());
            var truths = [];
            var promises=[];
            for(let i =0; i <contents.length; i++){
               // truths[i] = truth.ge
               promises[i] = truth.getTruthWithId(contents[i].truthId);      
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

room_truth.insertMultiple = (roomId, truths) => {
    return new Promise((resolve, reject) =>{ 
        let ops = [];
        for(let i =0; i <truths.length; i++){
            ops.push(room_truth.insert(roomId, truths[i].id));
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

room_truth.insert = (roomId, truthId) => {
    return new Promise((resolve, reject) =>{ 
        var id = uuidv4();
        Room_Truth.forge({id: id, roomId: roomId, truthId: truthId })
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

room_truth.getRandomTruths= (roomId) => {
    return new Promise((resolve, reject) =>{
        Room_Truth
        .where({roomId: roomId})
        .count().then(count => {
            Room_Truth.where({roomId: roomId})
            .query((qb) => {
                qb.offset(Math.floor(Math.random() * (count- 3)))
                qb.limit(3);
            }).fetchAll()
            .then((result)=>{
                let contents = Array.from(result.toJSON());

                let ops = [];
                
                for(let i =0; i <contents.length; i++){
                    ops.push(room_truth.updateTruthVotable(contents[i].id, true));
                }
              
                Promise.all(ops).then(result=>{
                    ops = [];

                    for(let i =0; i <contents.length; i++){
                        ops.push(truth.getById(contents[i].truthId));
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

room_truth.updateTruthVotable = (id, votable) => {
    return new Promise((resolve, reject) =>{
        Room_Truth.where({id: id})
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
room_truth.updateisInPlay = (roomId, truthId, isInPlay)=>{
    return new Promise((resolve, reject) =>{
        Room_Truth.query(function(qb) {
            qb.where({roomId: roomId});
            qb.where({truthId: truthId})
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

room_truth.updateRoomVoting = (roomId, votable) => {
    return new Promise((resolve, reject) =>{
        Room_Truth.where({roomId: roomId})
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

room_truth.getWinningTruth = (roomId) => {
    return new Promise((resolve, reject) =>{
        Room_Truth.where({roomId: roomId})
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

room_truth.deleteRoom = (roomId) => {
    return new Promise((resolve, reject) => {
        Room_Truth.where({roomId: roomId})
        .destroy({require: false})
        .then((result, error) => {        
            resolve(result);
        })
        .catch(error => {
            reject(error);
        })
    })
}


room_truth.deleteSingle = (roomId, truthId)=>{
    return new Promise((resolve, reject) => {
        Room_Truth.where({roomId: roomId, truthId: truthId})
        .destroy({require: false})
        .then((result, error) => {        
            resolve(result);
        })
        .catch(error => {
            reject(error);
        })
    })
}

room_truth.getVotableTruths = (roomId) => {
    return new Promise((resolve, reject) => {
        Room_Truth.query(function(qb) {
            qb.where({roomId: roomId});
            qb.where({isVotable: true});
        }).fetchAll()
        .then((result)=>{
            result = result.toJSON()

            let ops = [];

            for(let i =0; i <result.length; i++){
                ops.push(truth.getById(result[i].truthId));
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
room_truth.getTruthInPlayNotQuery=(roomId)=>{
    return new Promise((resolve, reject)=>{
        Room_Truth.where({roomId:roomId, isInPlay: true})
        .fetchAll()
        .then(result=>{
            resolve(Array.from(result.toJSON())[0]);
        })
        .catch("fail");
    })

}
room_truth.getTruthInPlay = (roomId) => {
    return new Promise((resolve, reject) => {
        Room_Truth.query(function(qb) {
            qb.where({roomId: roomId});
            qb.where({isInPlay: true});
            qb.limit(1);
        }).fetch()
        .then((result)=>{
            result = result.toJSON()
            console.log(result);
            Promise.resolve(
                truth.getById(result.truthId)
            )
            .then((result)=>{
                resolve(result);
            })
            .catch(err =>{
                //reject(err);
            })
        })
        .catch(err =>{
            //reject(err);
        })
    })
}

export default room_truth;