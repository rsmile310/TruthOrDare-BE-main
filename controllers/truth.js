import Truth from "../models/truth.js";

const truth = []

truth.getTruths = () => {
    return new Promise((resolve, reject) => {
        Truth.fetchAll()
        .then((result) => {
            resolve(result);
        })
    })
}

truth.getById = (id) =>{
    return new Promise((resolve, reject) => {
        Truth.where({id: id})
        .fetch()
        .then((result) => {
            resolve(result.toJSON());
        })
    })
}

truth.getNRandomTruths = (n) =>{
    return new Promise((resolve, reject)=>{ 
        Promise.resolve(
            truth.getTruths()
        )
        .then(result=>{
            // console.log(result);
            var truths=Array.from(result.toJSON());
            var truthsreturn = [];
            var randoms = [];
            randoms[0] = -1;
            
            for (let index = 0; index < n; index++) {
                var rand;
                do{
                    rand = Math.floor(Math.random() * truths.length);
                } while(randoms.includes(rand));
                randoms[index]= rand;
                truthsreturn[index] = truths[rand];     
            }

            resolve(truthsreturn);
        })
        .catch(err=>{
            console.log("error" + err);
        });
    })
}

export default truth;