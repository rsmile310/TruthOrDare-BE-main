import Dare from "../models/dare.js";

const dare = []

dare.getDares = () => {
    return new Promise((resolve, reject) => {
        Dare.fetchAll()
        .then((result) => {
            resolve(result);
        })
        .catch(err =>{
            reject(err);
        })
    })
}

dare.getById = (id) =>{
    return new Promise((resolve, reject) => {
        Dare.where({id: id})
        .fetch()
        .then((result) => {
            resolve(result.toJSON());
        })
        .catch(err =>{
            reject(err);
        })
    })
}

dare.getNRandomDares = (n) =>{
   return new Promise((resolve, reject)=>{ 
       Promise.resolve(
           dare.getDares()
        )
        .then(result=>{
            var dares=Array.from(result.toJSON());
            var daresreturn = [];
            var randoms = [];
            randoms[0] = -1;

            for (let index = 0; index < n; index++) {
                var rand;
                do{
                    rand = Math.floor(Math.random() * dares.length);
                }while(randoms.includes(rand));
                
                randoms[index]= rand;
                daresreturn[index] = dares[rand];            
            }

            resolve(daresreturn);
        })
        .catch(err=>{
            console.log("error" + err);
        });
    })
}

export default dare;