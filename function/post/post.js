const databaseHelper = require('../databaseHelper/databaseHelper')
var url = require('url');
var Log = require('../logger/log')
async function hasNew(){
    return new Promise((resolve,reject)=>{
        const pool = databaseHelper.pool
        const promisePool = pool.promise();
       
        var query = 'SELECT * FROM post ORDER BY _DATE DESC LIMIT 1'
        promisePool.query(query)
        .then(([result,field])=>{
            resolve  (result)
        }).catch((err)=>{
            console.log(err)
            return reject(err)
        })
    })
    .catch((error)=>{
        console.log(error)
    })
}
async function find(_ID){
    return new Promise((resolve,reject)=>{
        const pool = databaseHelper.pool
        const promisePool = pool.promise();
       
        var query = 'SELECT p.*,js,link'
        +' FROM irescue.post p'
        +' LEFT JOIN ('
            +' SELECT *,JSON_ARRAYAGG(JSON_OBJECT("PROVINCE",pl.PROVINCE,"MUNICIPAL",pl.MUNICIPAL,"ID",pl.ID)) as js  FROM irescue.post_location AS pl  GROUP BY pl.POST_ID'
        +' ) pl ON pl.POST_ID = p.ID'
        +' LEFT JOIN ('
            +' SELECT *,JSON_ARRAYAGG(JSON_OBJECT("ID",f.ID,"FILENAME",f.FILENAME,"PATH",f.PATH,"FILETYPE",f.FILETYPE,"POST_ID",f.POST_ID)) as link FROM irescue.post_links AS f GROUP BY f.POST_ID'
        +' ) pls ON pls.POST_ID = p.ID'
        +' WHERE p.ID =  '+ databaseHelper.mysql2Promise.escape(_ID)
        +' GROUP BY p.ID ORDER BY p._DATE DESC' 
        console.log(query)
        promisePool.query(query)
        .then(([result,field])=>{
            resolve  (result)
        }).catch((err)=>{
            console.log(err)
            return reject(err)
        })
    })
    .catch((error)=>{
        console.log(error)
    })
}

function findAll(keywords,offset){
    return new Promise((resolve,reject)=>{
        const pool = databaseHelper.pool
        const promisePool = pool.promise();
        let str_keywords = databaseHelper.mysql2Promise.escape('%'+keywords+'%')
        let str_offset = offset
        var query = `SELECT p.*,js,link
        FROM irescue.post p LEFT JOIN ( SELECT *,JSON_ARRAYAGG(JSON_OBJECT("PROVINCE",pl.PROVINCE,"MUNICIPAL",pl.MUNICIPAL,"ID",pl.ID)) as js  FROM irescue.post_location AS pl WHERE pl.MUNICIPAL LIKE `+str_keywords+` OR pl.PROVINCE LIKE `+str_keywords+` GROUP BY pl.POST_ID ) pl ON pl.POST_ID = p.ID LEFT JOIN (
        SELECT *,JSON_ARRAYAGG(JSON_OBJECT("ID",f.ID,"FILENAME",f.FILENAME,"PATH",f.PATH,"FILETYPE",f.FILETYPE,"POST_ID",f.POST_ID)) as link FROM irescue.post_links AS f GROUP BY f.POST_ID ) pls ON pls.POST_ID = p.ID
        WHERE  _DATE LIKE `+str_keywords+` OR BODY LIKE `+str_keywords+` OR POST_TYPE LIKE `+str_keywords+` OR ALERT_TYPE LIKE `+str_keywords+` GROUP BY p.ID ORDER BY p._DATE DESC`
        console.log(query);
        promisePool.query(query +' LIMIT '+str_offset+',5 ;')
        .then(([result,field])=>{
            resolve  (result)
        }).catch((err)=>{
            console.log(err)
            return reject(err)
        })
    })
    .catch((error)=>{
        console.log(error)
    })
}
async function create(data){
    return new Promise((resolve,reject)=>{
        let query = "INSERT INTO post SET ? ON DUPLICATE KEY UPDATE ?";
        const pool = databaseHelper.pool;
        const promisePool = pool.promise();
        promisePool.query(query, [data,data])
            .then(([result, field]) => {                
                if(result.affectedRows ==1){
                    return resolve(result);
                }else{
                    return resolve(false);
                }
            }).catch((err) => {
                console.log(err);
                return reject(err);
            });
    }).catch((err) => {
        console.log(err);
        Log.error({
            level: 'error',
            message: err.message +' '+ Date.now()
        });
        return err;
    });
}
function remove(_ID){
    return new Promise((resolve,reject)=>{
        let query = 'DELETE FROM `post` WHERE `ID` = ?'
        const pool = databaseHelper.pool
        const promisePool = pool.promise();
        promisePool.query(query,[_ID])
        .then(([result,field])=>{
            resolve  (result)
        }).catch((err)=>{
            console.log(err)
            Log.error({
                level: 'error',
                message: err.message +' '+ Date.now()
            });
            return reject(err)
        })
    })
}
module.exports ={
    hasNew,
    create,
    remove,
    find,
    findAll
}