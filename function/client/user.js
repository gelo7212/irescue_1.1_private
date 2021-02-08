var databaseHelper = require('./../databaseHelper/databaseHelper')
function create(data){
    var sql = "INSERT INTO client SET ? ";
    var details = {
        Client_ID:null,
        Client_FULLNAME:data.name,
        Client_AGE:0,
        Client_ADDRESS:'EMPTY',
        Client_MOBILE_NUMBER:0,
        Client_EMAIL:data.email,
        Client_PROFILE_PIC: data.picture.data.url,
        Client_PROVIDER:'facebook',
        Client_EMAIL_ISVERIFY:0,
        Client_NUMBER_ISVERIFY:0,
        Client_OPTION:'EMPTY'
    }
    console.log(details)
    databaseHelper.connection.query(sql,details,function (error, result, fields) {
        if(error){
            console.log(error.message)
            if(error.code ==='ER_DUP_ENTRY'){
                
            }
            return false
        }   else{
            return true
        }    
    })
}
async function findAll(searchBy,offset){
    try {
        return new Promise((resolve, reject) => {
            var i = 0;
            console.log('synchronously executed');
            const pool = databaseHelper.pool;
            const promisePool = pool.promise();
            let str = databaseHelper.mysql2Promise.escape('%' + searchBy + '%');
            var query = 'SELECT * FROM client WHERE Client_FULLNAME LIKE ' + str + ' OR Client_ADDRESS LIKE ' + str + ' OR  Client_MOBILE_NUMBER LIKE ' + str + ' OR Client_EMAIL LIKE ' + str;
            var query2 = 'SELECT COUNT(Client_ID) AS TOTAL FROM client WHERE Client_FULLNAME LIKE ' + str + ' OR Client_ADDRESS LIKE ' + str + ' OR  Client_MOBILE_NUMBER LIKE ' + str + ' OR Client_EMAIL LIKE ' + str;
            promisePool.query(query + ' LIMIT ' + offset + ',500; ' + query2)
                .then(([result, field]) => {
                    return resolve(result);
                }).catch((err) => {
                    console.log(err);
                    return reject(err);
                });
        });
    }
    catch (error) {
        console.log(error);
    }

}
async function find(_ID){
    return new Promise((resolve,reject)=>{
        const pool =databaseHelper.pool
        const promisePool =pool.promise();
        let str = databaseHelper.mysql2Promise.escape(_ID)
        promisePool.query('SELECT * FROM `client` WHERE Client_ID = '+str).then(([result,field])=>{
            return  resolve(result)
        }).catch(err=>{
            console.log(err)
            return reject(false)
        })
    
    }).catch(err=>{
        console.log(err)
        return(false)
    })
}
async function update(data){
    try {
        return new Promise((resolve, reject) => {
            let column = data.column
            let row = data.row
            let column_Str =''
            let i = 0; const col = column.length;
            for(; i < col; i++) {
                console.log(i ,' ', col)
                if(col == 0){
                    column_Str = column_Str + ' `'+column[i] + '` =? '
                }else if(i == col-1){
                    column_Str = column_Str + ' `'+column[i] + '` =? '
                }else{
                    column_Str = column_Str + ' `'+column[i] + '` =? , '
                }
            }
            let query = 'update `client` SET '+column_Str+' WHERE `Client_ID`= ?';
            console.log(query)
            const pool = databaseHelper.pool;
            const promisePool = pool.promise();
            promisePool.query(query, row)
                .then(([result, field]) => {
                    console.log(result);
                    
                    if(result.affectedRows ==1){
                        return resolve(true);
                    }else{
                        return resolve(false);
                    }
                }).catch((err) => {
                    console.log(err);
                    return reject(err);
                });
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    catch (err) {
        console.log(err);
        return (err);
    }        
}
async function Block(data){
    try {
        return new Promise((resolve, reject) => {
            let query = 'update `client` SET `Account_DISABLE`=? WHERE `Account_ID`= ?';
            const pool = databaseHelper.pool;
            const promisePool = pool.promise();
            promisePool.query(query, data)
                .then(([result, field]) => {
                    console.log(result);
                    resolve(result);
                }).catch((err) => {
                    console.log(err);
                    return reject(err);
                });
        });
    }
    catch (err) {
        console.log(err);
        return (err);
    }
}    

module.exports ={
    create,
    findAll,
    find,
    update,
}