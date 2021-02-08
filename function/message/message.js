const databaseHelper = require('../databaseHelper/databaseHelper')
var url = require('url');
var Log = require('../logger/log')

async function send(thread_id,body,to){
    return new Promise((resolve,reject)=>{
        let data = {
            ID:null,
            THREAD_ID:thread_id,
            SEND_DATE:new Date(),
            BODY:body,
            SENDING_USER_ID:to
        }
        let query = "INSERT INTO message SET ?";
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
async function findOnMessageAndThreadParticipantByUserID(TO, USER_ID,LIMIT){
    return new Promise((resolve,reject)=>{
       /*  //let query = 'SELECT * FROM `irescue`.`message` AS m '+
        //    'lEFT JOIN (SELECT * FROM `irescue`.`thread_participant` AS tp) tp ON tp.THREAD_ID = m.THREAD_ID '+
        //    'WHERE m.SENDING_USER_ID = ? AND tp.USER_ID = ? OR m.SENDING_USER_ID = ? AND tp.USER_ID = ? group by m.ID LIMIT ? ,5';
        let query = 
        'SELECT * FROM `irescue`.`thread_participant` '+ 
            'JOIN ( '+
                    'SELECT * FROM `irescue`.`thread_participant` as tp2 '+
                    'WHERE tp2.USER_ID = ?  '+
                ')as tp2 ON tp2.THREAD_ID  = thread_participant.THREAD_ID '+
        'WHERE thread_participant.USER_ID = ? ' */
        let query = 
        'select tr1.THREAD_ID  '+
        'from `irescue`.`thread_participant`  tr1   '+
        'join `irescue`.`thread_participant` tr2 on tr2.THREAD_ID = tr1.THREAD_ID  '+
            'and tr2.USER_ID = ? '+
        'left join `irescue`.`thread_participant` tr3 on tr3.THREAD_ID = tr1.THREAD_ID '+
            'and tr3.USER_ID not in (?, ?) '+
        'where tr1.USER_ID = ? '+
        'and tr3.USER_ID is null ';

        const pool = databaseHelper.pool;
        const promisePool = pool.promise();
        promisePool.query(query, [ USER_ID,TO,USER_ID,TO])
        .then(([result, field]) => {       
                return resolve(result);
        }).catch((err) => {
            console.log(err);
            return reject(false);
        });
    })
}
async function findOnMessageAndThreadParticipant(THREAD_ID,LIMIT){
    return new Promise((resolve,reject)=>{
        //let query = 'SELECT * FROM `irescue`.`message` AS m '+
           // 'lEFT JOIN (SELECT * FROM `irescue`.`thread_participant` AS tp) tp ON tp.THREAD_ID = m.THREAD_ID WHERE m.SENDING_USER_ID = ? AND tp.USER_ID = ? OR m.SENDING_USER_ID = ? AND tp.USER_ID = ? group by m.ID  order by m.SEND_DATE DESC LIMIT '+LIMIT+' ,10';
        let query = 'SELECT * FROM `irescue`.`message` AS m WHERE m.THREAD_ID = ?   order by m.SEND_DATE DESC LIMIT '+LIMIT+' ,10'
           const pool = databaseHelper.pool;
        const promisePool = pool.promise();
        promisePool.query(query, [ THREAD_ID])
        .then(([result, field]) => {    
            if(result.length==0){
                return reject(false)
            }else{
                return resolve(result);
            }
                
        }).catch((err) => {
            console.log(err);
            return reject(false);
        });
    })
}
async function find(option){
    return new Promise((resolve,reject)=>{
        console.log(option.val)
        let query = findBy[option.column];
        const pool = databaseHelper.pool;
        const promisePool = pool.promise();
        promisePool.query(query, [option.val])
        .then(([result, field]) => {       
                return resolve(result);
        }).catch((err) => {
            console.log(err);
            return reject(false);
        });
    })
}
function Add(MESS_ID,USER_ID){
    return new Promise((resolve,reject)=>{
        let query = 'INSERT INTO `irescue`.`message_read_state` '+
        '(`MESSAGE_ID`, '+
        '`USER_ID`, '+
        '`READ_DATE`) '+
        'VALUES '+
        '(?, '+
        '?, '+
        'null); '
        const pool = databaseHelper.pool;
        const promisePool = pool.promise();
        promisePool.query(query, [ MESS_ID, USER_ID])
        .then(([result, field]) => {       
                return resolve(result);
        }).catch((err) => {
            console.log(err);
            return reject(false);
        });
    })
}
function Update(MESS_ID,USER_ID){
    return new Promise((resolve,reject)=>{
        let query = 'INSERT INTO `irescue`.`message_read_state` '+
        '(`MESSAGE_ID`, '+
        '`USER_ID`, '+
        '`READ_DATE`) '+
        'VALUES '+
        '(?, '+
        '?, '+
        'null); '
        const pool = databaseHelper.pool;
        const promisePool = pool.promise();
        promisePool.query(query, [ MESS_ID, USER_ID])
        .then(([result, field]) => {       
                return resolve(result);
        }).catch((err) => {
            console.log(err);
            return reject(false);
        });
    })
}
let findBy ={
    thread_id: "SELECT * FROM message WHERE  THREAD_ID LIKE ?",
    body:"SELECT * FROM message WHERE BODY LIKE ?",
    sender:"SELECT * FROM message WHERE  SENDING_USER_ID LIKE ? ",
    id: "SELECT * FROM message WHERE  ID LIKE ?"
}
module.exports ={
    send,
    find,
    findOnMessageAndThreadParticipant,
    findOnMessageAndThreadParticipantByUserID
}