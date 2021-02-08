var databaseHelper = require('../databaseHelper/databaseHelper')

function insertPass(hash,id,table,next){
    var details = {
        _ID:id,
        HASH_PASSWORD:hash
    }
    console.log(details)
    databaseHelper.pool_pass.query('INSERT INTO '+table+' SET ? ON DUPLICATE KEY UPDATE ?',[details,details],function (error, result, fields) {
        if(error) {
            console.log(error.message)
            throw error
        }
       
    })
}
function updatePass(hash,id,table){
    var details = {
        HASH_PASSWORD:hash
    }
    databaseHelper.pool_pass.query('UPDATE '+table+' SET ? WHERE _ID LIKE '+ id,details,function (error, result, fields) {
        if(error) {
            console.log()
            throw err
        }else{ 
            console.log('changed ' + result.changedRows + ' rows');
        }
       
    })
}
function deletePass(id,table){
    databaseHelper.pool_pass.query('DELETE FROM '+table+' WHERE _ID LIKE '+ id,function (error, result, fields) {
        if(error) {
            console.log()
            throw err
        }else{ 
            console.log('deleted ' + result.affectedRows + ' rows');
        }
       
    })
}
async function getPass(id,table){
    try{
        var pool =await databaseHelper.pool_pass
        const promisePool =await pool.promise();
        console.log(id,table)
        const [result,field]= await promisePool.query('SELECT HASH_PASSWORD FROM '+table+' WHERE _ID LIKE "'+ id+'"')
        for (const r of result) { 
            return await r.HASH_PASSWORD;
          }
          
    }catch(e){
        console.log(e)
    }
   
   /*  databaseHelper.CONN_TO_ACCOUNT.query(,function (error, result, fields) {
        if(error) {
            console.log(error.message)
            throw error
        }else{
            Object.keys(result).forEach(function(key) {
                var row = result[key];
                return row.HASH_PASSWORD
            })
        } 
       
    })*/
}
module.exports ={
        insertPass,
        updatePass,
        deletePass,
        getPass 
    }