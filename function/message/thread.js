const databaseHelper = require('../databaseHelper/databaseHelper')

async function create(){
    return new Promise((resolve,reject)=>{
        let data ={
            ID:null
        }
        let query = "INSERT INTO thread SET ? ON DUPLICATE KEY UPDATE ?";
        const pool = databaseHelper.pool;
        const promisePool = pool.promise();
        promisePool.query(query, [data,data])
            .then(([result, field]) => {                
                if(result.affectedRows ==1){
                    return resolve(result.insertId);
                }else{
                    return resolve(false);
                }
            }).catch((err) => {
                console.log(err);
                return reject(false);
            });
    })
}
async function find(id){
    return new Promise((resolve,reject)=>{
        let query = "SELECT * FROM thread WHERE ID LIKE ?";
        const pool = databaseHelper.pool;
        const promisePool = pool.promise();
        promisePool.query(query, [id])
            .then(([result, field]) => {       
                console.log(result)         
                if(result){
                    return resolve(result);
                }else{
                    return resolve(false);
                }
            }).catch((err) => {
                console.log(err);
                return reject(false);
            });
    })
}
module.exports ={
    create,
    find
}