const databaseHelper = require('../databaseHelper/databaseHelper')
var url = require('url');
var Log = require('../logger/log')
async function find(_ID){
    return new Promise((resolve,reject)=>{
        const pool =databaseHelper.pool
        const promisePool =pool.promise();
        let str = databaseHelper.mysql2Promise.escape(_ID)
        promisePool.query('SELECT * FROM `post_location` WHERE ID = '+str).then(([result,field])=>{
            return  resolve(result)
        }).catch(err=>{
            console.log(err)
            return reject(false)
        })
    
    }).catch(err=>{
        console.log(err)
        Log.error({
            level: 'error',
            message: err.message +' '+ Date.now()
        });
        return(false)
    })
}
async function create(data){
    return new Promise((resolve,reject)=>{
        let query = "INSERT INTO post_location  (PROVINCE ,MUNICIPAL, POST_ID) VALUES ?";
        const pool = databaseHelper.pool;
        const promisePool = pool.promise();
        promisePool.query(query, [data])
            .then(([result, field]) => {
                //console.log(result);
                if(result.affectedRows >=1){
                    return resolve(result);
                }else{
                    return resolve(false);
                }
            }).catch((err) => {
                console.log(err);
                return reject(false);
            });
    }).catch((err) => {
        console.log(err);
        Log.error({
            level: 'error',
            message: err.message +' '+ Date.now()
        });
        return false;
    });
}
async function remove(_ID){
    try {
        return new Promise((resolve, reject) => {
            let query = 'DELETE FROM `post_location` WHERE `POST_ID` = ?';
            console.log(data);
            const pool = databaseHelper.pool;
            const promisePool = pool.promise();
            promisePool.query(query, [_ID])
                .then(([result, field]) => {
                    resolve(result);
                }).catch((err) => {
                    console.log(err);
                    Log.error({
                        level: 'error',
                        message: err.message +' '+ Date.now()
                    });
                    return reject(false);
                });
        });
    }
    catch (err) {
        console.log(err);
    }
}
async function Location_arr(arr,province,id){
     try {
        return new Promise((resolve, reject) => {
            const municipal = ["Angat","Balagtas","Baliuag","Bocaue","Bulakan","Bustos","Calumpit","DRT","Guiguinto","Hagonoy","Malolos","Marilao","Meycauayan","Norzagaray","Obando","Pandi","Paombong","Plaridel","Pulilan","San Ildefonso","San Jose Del Monte","San Miguel","San Miguel","San Rafael","Santa Maria"]
            let ret_arr = [];
            arr.forEach(function (element) {
                if(municipal.includes(element)){
                    ret_arr.push([province, element, id]);
                }             
            });
            if(ret_arr.length == 0){
                return resolve (false)
            }else{
                 return resolve(ret_arr);
            }
        });
    }
    catch (err) {
        console.log(err);
        Log.error({
            level: 'error',
            message: err.SyntaxError +' '+ Date.now()
        });
        return false
    }
   
}
module.exports ={
    create,
    remove,
    find,
    Location_arr
}