const databaseHelper = require('../databaseHelper/databaseHelper')
async function create(thread_id , user_id){
    return new Promise((resolve,reject)=>{
        let data = {
            THREAD_ID:thread_id,
            USER_ID:user_id
        }
        let query = "INSERT INTO thread_participant SET ?";
        const pool = databaseHelper.pool;
        const promisePool = pool.promise();
        promisePool.query(query, [data,data])
            .then(([result, field]) => {                
                if(result.affectedRows ==1){
                    return resolve(thread_id);
                }else{
                    return resolve(false);
                }
            }).catch((err) => {
                console.log(err);
                return reject(false);
            });
    })
}
async function find(user_id,to_user_id){
    return new Promise((resolve,reject)=>{
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
        promisePool.query(query, [ user_id,to_user_id,user_id,to_user_id])
            .then(([result, field]) => { 
                if(result.length==0){
                    return reject(false);
                } else{
                    return resolve(result);
                }
            }).catch((err) => {
                console.log(err);
                return reject(false);
            });
    })
}
async function get(USER_ID,OFFSET){
    return new Promise((resolve,reject)=>{
        let query =
        
        ' SELECT `message`.`ID` '+
        ', '+
        ' `message`.`THREAD_ID` '+
        ',`message`.`SEND_DATE` '+
        ' ,`message`.`BODY` '+
        ' , `account_admin`.`Account_NAME` '+

        ' ,`account_admin`.`Account_ID` '+
        ',`message`.`SENDING_USER_ID` '+
        ', COALESCE( ( '+
            'SELECT `message_read_state`.`READ_DATE`  '+
              ' FROM `irescue`.`message_read_state`  '+
               'WHERE `message_read_state`.`MESSAGE_ID` = `message`.`ID`  '+
                ' and `message_read_state`.`USER_ID` = ? '+
                ' ),false '+
        ') AS ReadState  '+
        ', COALESCE( '+
           ' (SELECT `thread_participant`.`USER_ID` as user_ID FROM `irescue`.`thread_participant`  '+
                  'WHERE `thread_participant`.`USER_ID` != ? AND `thread_participant`.`THREAD_ID` = `message`.`THREAD_ID` '+
               '   ), '+
            '(SELECT `thread_participant`.`USER_ID` as user_ID FROM `irescue`.`thread_participant`  '+
                 ' WHERE `thread_participant`.`USER_ID` = ? AND `thread_participant`.`THREAD_ID` = `message`.`THREAD_ID` '+
                '  LIMIT 1 '+
                '  ) '+
            ') AS recipient '+
            ', COALESCE(( '+
             'SELECT `account_admin`.Account_NAME FROM `irescue`.`account_admin` '+
                'JOIN `irescue`.`thread_participant` ON USER_ID = Account_ID '+
                 ' WHERE `thread_participant`.`USER_ID` != ? AND `thread_participant`.`THREAD_ID` = `message`.`THREAD_ID` '+
           ' ),( SELECT `account_admin`.Account_NAME FROM `irescue`.`account_admin` '+
                'JOIN `irescue`.`thread_participant` ON USER_ID = Account_ID '+
                 ' WHERE `thread_participant`.`USER_ID` = ? AND `thread_participant`.`THREAD_ID` = `message`.`THREAD_ID` '+
                 ' LIMIT 1)) AS recipient_name '+
        'FROM `irescue`.`message` INNER JOIN `irescue`.`account_admin` ON `message`.`SENDING_USER_ID` = `account_admin`.`Account_ID` '+
        'WHERE ( `message`.`ID` in  '+
                '( SELECT Max(`message`.`ID`) '+
                'FROM `irescue`.`thread_participant` INNER JOIN `irescue`.`message`  '+
                '  ON `thread_participant`.`THREAD_ID` = `message`.`THREAD_ID` '+
                'WHERE `thread_participant`.`USER_ID`= ? '+
                ' GROUP BY `thread_participant`.`THREAD_ID` '+
                ') '+
            ') '+
        'ORDER BY `message`.`SEND_DATE` DESC LIMIT '+OFFSET+',10 ; '
        //'ORDER BY m.SEND_DATE DESC LIMIT '+OFFSET+',10 '
        const pool = databaseHelper.pool;
        const promisePool = pool.promise();
        promisePool.query(query, [USER_ID,USER_ID,USER_ID,USER_ID,USER_ID,USER_ID])
            .then(([result, field]) => {
                return resolve(result);
            }).catch((err) => {
                console.log(err);
                return reject(false);
            });
    })
}    

module.exports ={
    create,
    find,
    get
}