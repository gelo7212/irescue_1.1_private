
const databaseHelper = require('./../databaseHelper/databaseHelper')
var url = require('url');
const me = require('../me')
//====================================ADMIN FUNCTIONS======================================
function checkadminCount(req,res,next){
    databaseHelper.pool.query('SELECT COUNT(*) AS AdminCount FROM account_admin WHERE Account_ISVERIFY = 1 LIMIT 2',function (error, result, fields) {
        if(error) {
            console.log(error)
            res.sendStatus(500)
        }
        else{
            Object.keys(result).forEach(function(key) {
                const row = result[key];
                if(row.AdminCount==0){ 
                    res.redirect('/Administrator/setup')
                }else{
                    next()
                }
            })
        }
        
    })
}
function checkadmin(req,res,next){
    try {
        databaseHelper.pool.query('SELECT COUNT(*) AS AdminCount FROM account_admin WHERE Account_ISVERIFY = 1 LIMIT 2',function (error, result, fields) {
            if(error) {console.log(error)
                res.sendStatus(500)
            }else{
                Object.keys(result).forEach(function(key) {
                    const row = result[key];
                    if(row.AdminCount==0){ 
                        next()
                    }else{
                        res.redirect('/Administrator')
                    }
                })
            }
            
        })
    } catch (error) {
        console.error(error)
    }
}
function CountAdmin(){
    
}
async function isExist(value,col,table){
    try {
        const pool =databaseHelper.pool
        const promisePool =pool.promise();
        const[result,field] =await promisePool.query('SELECT EXISTS(SELECT * FROM '+table+' WHERE '+col+' ="'+value+'")') 
        for(const o of result){
           return {
               a: Object.values(o),
               existIn: col,
               withValue: value
           }
        }
           
        
        return rs
        //promisePool.end()
    } catch (error) {
        
    }
}
async function userTempInfo(_ID){
    try {
        const pool =databaseHelper.pool
        const promisePool =pool.promise();
        const [result,field] = await promisePool.query('SELECT * FROM temp_reg WHERE UUID ="'+_ID+'"')       
        for (const r of result) {
            return {
                UUID: r.UUID,
                EMAIL: r.email,
                TOKEN: r.temp_jwt
            }
        }
        //promisePool.end()
    } catch (e) {
        console.log(e)
    }
}
Object.size =async function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
async function listUsers(){
    try {
        return new Promise((resolve, reject) => {
            const pool = databaseHelper.pool;
            const promisePool = pool.promise();
            promisePool.query('SELECT * FROM account_admin  LIMIT 500')
                .then(([result, field]) => {
                    resolve(result);
                }).catch((err) => {
                    console.log(err);
                    return reject(err);
                });
        });
    }
    catch (err) {
        console.log(err);
    }
    
    
    
}
function users(searchBy,offset){
        return new Promise((resolve,reject)=>{
            const pool = databaseHelper.pool
            const promisePool = pool.promise();
            let str = databaseHelper.mysql2Promise.escape('%'+searchBy+'%')
            var query = 'SELECT * FROM account_admin WHERE Account_NAME LIKE '+str+' OR Account_USERNAME LIKE '+str+' OR  Account_TYPE_ID LIKE '+str+' OR Account_EMAIL LIKE '+str+' OR  Account_Province LIKE '+str+' OR Account_Municipal LIKE '+str+' OR Account_Barangay LIKE '+str+' OR Account_ISVERIFY LIKE '+str+''
            var query2 = 'SELECT COUNT(Account_ID) AS TOTAL FROM account_admin WHERE Account_NAME LIKE '+str+' OR Account_USERNAME LIKE '+str+' OR  Account_TYPE_ID LIKE '+str+' OR Account_EMAIL LIKE '+str+' OR  Account_Province LIKE '+str+' OR Account_Municipal LIKE '+str+' OR Account_Barangay LIKE '+str+' OR Account_ISVERIFY LIKE '+str+''
            promisePool.query(query +' LIMIT '+offset+',500; '+query2)
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
async function deleteTempAccount(_ID){
    try {
        const pool =databaseHelper.pool
        const promisePool =pool.promise();
        const [error,result,field] = await promisePool.query('DELETE FROM `temp_reg` WHERE UUID ="'+_ID+'"')       
        if (error) throw error
            //promisePool.end()
    } catch (e) {
        console.log(e)
    }
}
function create_temp_account(req,res,next,data){
    const sql = "INSERT INTO temp_reg SET ? ON DUPLICATE KEY UPDATE ?";
    const uuid = me.uuid.generate(data.Account_EMAIL)
    const firstAccount = data.isFirst 
    delete data.isFirst
    me.jwt.encrypt(data,'1d').then(tempJwt=>{
        console.log(uuid)
        const details = {
            UUID:uuid,
            email:data.Account_EMAIL,
            temp_jwt: tempJwt
        }
        
        databaseHelper.pool.query(sql,[details,details],function(error,result,fields){
            if(error){
                console.log(error.message)
                if(error.code ==='ER_DUP_ENTRY'){
                    
                }
                res.render('includes/components/alert/alert-danger',{heading:'Failed.',message:error.code,message_bottom:error.message,success:false})
            }else{
                //email.sendEmail()
                if(firstAccount){
                    var code = me.email.createRandomKey()
                    req.session._code = code
                    me.email.sendEmail('irescue <admin@irescue.com>','malupertcbenteono@gmail.com','TEST','TESTING EMAIL','<h1>YOUR CODE IS '+code+'</h1>')
                    
                    res.send({link:'/Administrator/setup/'+uuid+'?email='+req.body.email+'&name='+req.body.firstname+' '+req.body.lastname+'&username='+req.body.username,success:true})
                
                }else{
                    res.render('includes/components/alert/alert-success',
                    {
                        heading:'Link sent to '+ details.email,
                        message: getFormattedUrl(req)+'/Administrator/account/'+ uuid,
                        message_bottom:'',
                        success:true
                    })

                console.log(details)
                }
                
            }    
        })
    })
    
    
}
function getFormattedUrl(req) {
    return url.format({
        protocol: req.protocol,
        host: req.get('host')
    });
} 
 function createMillionRecord(req,res,next,data){
    try {
        const sql = "INSERT INTO account_admin SET ? ON DUPLICATE KEY UPDATE ?";
        const details = {
            Account_ID:null,
            Account_NAME:data.Account_NAME,
            Account_USERNAME:data.Account_USERNAME,
            Account_TYPE_ID:data.Account_TYPE_ID,
            Account_EMAIL:data.Account_EMAIL,
            Account_Province:data.Account_Province,
            Account_ISVERIFY:!data.Account_ISVERIFY
            //password=malupertcbenteono%40gmail.com&username=ronilodeguzman%40google.com&level=Super%20Admin&location=2&password=123456
        }
        databaseHelper.pool.query(sql,[details,details],async function (error, result, fields) {
            if(error){
                console.log(error.message)
                if(error.code ==='ER_DUP_ENTRY'){
                     
                }
                console.error(error.message)
                next(error)
            }else{
                res.send(details)
                console.log('this is create aacount ')
            }    
        })
    } catch (error) {
        console.error(error)
    }
}
function create_Admin_Account(req,res,next,data,link){
    try {
        const sql = "INSERT INTO account_admin SET ? ON DUPLICATE KEY UPDATE ?";
        
        const details = {
            Account_ID:null,
            Account_NAME:data.Account_NAME,
            Account_USERNAME:data.Account_USERNAME,
            Account_TYPE_ID:data.Account_TYPE_ID,
            Account_EMAIL:data.Account_EMAIL,
            Account_Province:data.Account_Province,
            Account_Municipal:data.Account_Municipal,
            Account_Barangay:data.Account_Barangay,
            Account_ISVERIFY:!data.Account_ISVERIFY
            //password=malupertcbenteono%40gmail.com&username=ronilodeguzman%40google.com&level=Super%20Admin&location=2&password=123456
        }
        if(typeof data.Account_Municipal ==='undefined'){
            delete details.Account_Municipal;
        }if(typeof data.Account_Barangay === 'undefined' ){
            delete details.Account_Barangay
        }
        databaseHelper.pool.query(sql,[details,details],async function (error, result, fields) {
            if(error){
                console.log(error.message)
                if(error.code ==='ER_DUP_ENTRY'){
                     
                }
                console.error(error.message)
                next(error)
            }else{
                if(typeof link !== ''){
                    me.password.insertPass(me.bcrypt.hashPlainPass(req.body.password),result.insertId,'account_admin',next)
                    const userTempDetails = await userTempInfo(req.params.token) 
                    await deleteTempAccount(userTempDetails.UUID)
                    console.log('this is create aacount ')
                    
                }else{
                    console.log(link,' no link')
                   
                }
                
            }    
        })
    } catch (error) {
        console.error(error)
    }
}
async function encrypt(req,res,next){
    const data = {
        Account_ID:null,
        Account_NAME:req.body.firstname+' '+req.body.lastname,
        Account_USERNAME:req.body.username,
        Account_TYPE_ID:req.body.level,
        Account_EMAIL:req.body.email,
        Account_Province:req.body.location,
        Account_ISVERIFY:false
    }
    await me.jwt.encrypt(data,60*60).then(async token =>{
        return await token
    })
    
}
function jwt_stat(req,res,next){
    me.jwt.decrypt(req.params.token).then(decoded=>{
        if(decoded != false){
            next()
        }else{
            res.redirect('/Administrator/setup/')
        }
    })

    
}

 async function isRegister(username){
    try {
        const pool =databaseHelper.pool
        const promisePool = pool.promise();
        let query = 'SELECT COUNT(*) AS AdminCount ,`Account_ID` FROM account_admin WHERE Account_USERNAME LIKE '+databaseHelper.mysql2Promise.escape(username)
        console.log(query)
        const [result,field] = await promisePool.query(query)       
       
        for (const r of result) {
            if(r.AdminCount==1){
                return await r.Account_ID
            }else{
                return false   
            }
        }
        //promisePool.end()
    } catch (e) {
        console.log(e)
    }
}
async function info(_ID){
    try {
        const pool =databaseHelper.pool
        const promisePool =pool.promise();
        const [result,field] = await promisePool.query('SELECT * FROM `account_admin` WHERE Account_ID = "'+_ID+'"')   
        for (const r of result) {
            return {
                Account_ID: r.Account_ID,
                Account_NAME: r.Account_NAME,
                Account_USERNAME: r.Account_USERNAME,
                Account_TYPE_ID: r.Account_TYPE_ID,
                Account_EMAIL: r.Account_EMAIL,
                Account_Province: r.Account_Province,
                Account_ISVERIFY: r.Account_ISVERIFY,
                Account_Municipal: r.Account_Municipal,
                Account_Barangay: r.Account_Barangay,
                Account_ISVERIFY: r.Account_ISVERIFY,
                Account_DISABLE: r.Account_DISABLE
            }
        } 
        //promisePool.end()
    } catch (e) {
        console.log(e)
        return e;
        
    }
}
//==============================UPDATE ADMMIN===============================
function UpdateAdmin(data){
    return new Promise((resolve,reject)=>{
        let query = 'UPDATE `account_admin` SET `Account_NAME`=?,`Account_EMAIL`=?,`Account_TYPE_ID`= ? , `Account_Province`=?,`Account_Municipal`=?,`Account_Barangay`= ? WHERE `Account_ID`= ?'
        const pool = databaseHelper.pool
        const promisePool = pool.promise();
        console.log([data.Account_NAME,data.Account_EMAIL,data.Account_TYPE_ID,data.Account_Province,data.Account_Municipal,data.Account_Barangay,data.Account_ID])
        promisePool.query(query,[data.Account_NAME,data.Account_EMAIL,data.Account_TYPE_ID,data.Account_Province,data.Account_Municipal,data.Account_Barangay,parseInt(data.Account_ID)])
        .then(([result,field])=>{
            console.log(result)
            resolve  (result)
        }).catch((err)=>{
            console.log(err)
            return reject(err)
        })
    }).catch((err)=>{
        console.log(err)
        return (err)
    })
}
function Update_low_level_Admin(data){
    return new Promise((resolve,reject)=>{
        let query = 'UPDATE `account_admin` SET `Account_NAME`=?,`Account_EMAIL`=? WHERE `Account_ID`= ?'

    })
}
function Block_Unblock_Account(data){
    return new Promise((resolve,reject)=>{
        let query = 'UPDATE `account_admin` SET `Account_DISABLE`=? WHERE `Account_ID`= ?'
        const pool = databaseHelper.pool
        const promisePool = pool.promise();
        promisePool.query(query,data)
        .then(([result,field])=>{
            console.log(result)
            resolve  (result)
        }).catch((err)=>{
            console.log(err)
            return reject(err)
        })
    }).catch((err)=>{
        console.log(err)
        return (err)
    })
}
function ForceVerified(data){
    return new Promise((resolve,reject)=>{
        let query = 'UPDATE `account_admin` SET `Account_ISVERIFY`=? WHERE `Account_ID`= ?'
        const pool = databaseHelper.pool
        const promisePool = pool.promise();
        promisePool.query(query,data)
        .then(([result,field])=>{
            resolve  (result)
        }).catch((err)=>{
            console.log(err)
            return reject(err)
        })
    }).catch((err)=>{
        console.log(err)
        return (err)
    })
}
//============================DELETE ADMIN==================================
function DeleteAcc(data){
    return new Promise((resolve,reject)=>{
        let query = 'DELETE FROM `account_admin` WHERE `Account_ID` = ?'
        console.log(data)
        const pool = databaseHelper.pool
        const promisePool = pool.promise();
        promisePool.query(query,[data])
        .then(([result,field])=>{
            resolve  (result)
        }).catch((err)=>{
            console.log(err)
            return reject(err)
        })
    })
}
function Logger(){
    return new Promise((resolve,reject)=>{
        let query = 'UPDATE'
    })
}
//===========================CHECK TOkEN====================================
function checkToken(req,res,next){
    const token = req.cookies['_d.r']
    if(typeof token !== 'undefined'){
        
        redirectToadmin(req,res,next)
    }else{
        res.render('index')
    }
}
function redirectToadmin(req,res,next){
    me.jwt.decrypt(req.cookies['_d.r']).then(d_token=>{
        console.log(d_token)
        if(d_token!=false){
            req.decoded = d_token
            info(d_token.Account_ID).then(data=>{
                if(d_token.Account_EMAIL == data.Account_EMAIL && data.Account_DISABLE == false){
                    next()
                }else{
                    /* para sa s */
                    res.render('index', { title: 'Express' });
                }
            }).catch(err=>{
                console.log(err)
            })
            
        }else{
            res.render('index', { title: 'Express' });
        }
    })
   
}
//=========================================VERIFY LOCATION=============================
function Location (lvl,province,municipal,barangay){
    return new Promise ((resolve,reject)=>{/* 
        Account_Province:req.body.Province,
        Account_Municipal:req.body.Municipal,
        Account_Barangay:req.body.Barangay, */
        let Data ={
        }
        permission(lvl).then(([a,b])=>{
            if(a){
                if(b === 'CA'){
                    prov(province).then(pm=>{
                        if(pm){
                            return resolve({
                                Account_Province:province,
                                Account_Municipal:'N/A',
                                Account_Barangay:'N/A'
                            })
                        }
                        else{
                            return reject(false)
                        }
                    })
                }else if(b === 'MA'){
                    province_municipal(municipal,province).then(pm=>{
                        if(pm){
                            return resolve({
                                Account_Province:province,
                                Account_Municipal:municipal,
                                Account_Barangay:'N/A'
                            })
                        }
                        else{
                            return reject(false)
                        }
                    })
                }else{
                    province_municipal(municipal,province).then(pm=>{
                        if(pm){
                            brgy(municipal,barangay).then(pm=>{
                                if(pm){
                                    return resolve({
                                        Account_Province:province,
                                        Account_Municipal:municipal,
                                        Account_Barangay:barangay
                                    })
                                }else{
                                    return reject(false)
                                }
                                
                            })
                           
                        }
                        else{
                            return reject(false)
                        }
                    })
                }
            }else{
                return reject(false)
            }
        })
        
    }).catch(err=>{
        console.log(err);
        return false
    })
}
function permission(lvl){
    return new Promise((resolve,reject)=>{
        const permissionLvl = [
            'CA',
            'MA',
            'BH',
            'PS',
            'AMBU',
            'FS'
        ]
        return resolve( [permissionLvl.includes(lvl),lvl])
    }).catch(()=>{
        return reject ([false,false])
    })
   
}
async function prov(province){
    try {
        return new Promise((resolve, reject) => {
            const MunicipalByCategory = {
                BULACAN: ["Angat", "Balagtas", "Baliuag", "Bocaue", "Bulakan", "Bustos", "Calumpit", "DRT", "Guiguinto", "Hagonoy", "Malolos", "Marilao", "Meycauayan", "Norzagaray", "Obando", "Pandi", "Paombong", "Plaridel", "Pulilan", "San Ildefonso", "San Jose Del Monte", "San Miguel", "San Miguel", "San Rafael", "Santa Maria"]
            };
            return resolve(MunicipalByCategory.hasOwnProperty(province));
        });
    }
    catch (e) {
        return reject(false);
    }
   
   
}
async function province_municipal(municipal,province){
    try {
        return new Promise((resolve, reject) => {
            const MunicipalByCategory = {
                BULACAN: ["Angat", "Balagtas", "Baliuag", "Bocaue", "Bulakan", "Bustos", "Calumpit", "DRT", "Guiguinto", "Hagonoy", "Malolos", "Marilao", "Meycauayan", "Norzagaray", "Obando", "Pandi", "Paombong", "Plaridel", "Pulilan", "San Ildefonso", "San Jose Del Monte", "San Miguel", "San Miguel", "San Rafael", "Santa Maria"]
            };
            if (MunicipalByCategory.hasOwnProperty(province)) {
                return resolve(MunicipalByCategory[province].includes(municipal));
            }
            else {
                return resolve(false);
            }
        });
    }
    catch (e) {
        return reject(false);
    }
    
}
async function brgy(municipal,barangay){
    try {
        return new Promise((resolve, reject) => {
            const BarangayByCategory = {
                Angat: ["Banaban", "Baybay", "Binagbag", "Donacion", "Encanto", "Laog", "Marungko", "Niugan", "Paltok", "Pulong Yantok", "San Roque", "Santa Cruz", "Santa Lucia", "Santo Cristo", "Sulucan", "Taboc"],
                Balagtas: ["Borol 2nd", "Borol 1st", "Dalig", "Longos", "Panginay", "Pulong Gubat", "San Juan", "Santol", "Wawa "],
                Baliuag: ["Bagong Nayon", "Barangca", "Calantipay", "Catulinan", "Concepcion", "Hinukay", "Makinabang", "Matangtubig", "Pagala", "Paitan", "Piel", "Pinagbarilan", "Poblacion", "Sabang", "San Jose", "San Roque", "Santa Barbara", "Santo Cristo", "Santo Niño", "Subic", "Sulivan", "Tangos", "Tarcan", "Tiaong", "Tibag", "Tilapayong"],
                Bocaue: ["Antipona", "Bagumbayan", "Bambang", "Batia", "Biñang 1st", "Biñang 2nd", "Bolacan", "Bundukan", "Bunlo", "Caingin", "Duhat", "Igulot", "Lolomboy", "Poblacion", "Sulucan", "Taal", "Tambobong", "Turo"],
                Bulakan: ["Bagumbayan", "Balubad", "Bambang", "Matungao", "Maysantol", "Perez", "Pitpitan", "San Francisco", "San Jose (Poblacion)", "San Nicolas", "Santa Ana", "Santa Ines", "Taliptip"],
                Bustos: ["Bonga Mayor", "Bonga Menor", "Buisan", "Camachilihan", "Cambaog", "Catacte", "Liciada", "Malamig", "Malawak", "Poblacion", "San Pedro", "Talampas", "Tanawan"],
                Calumpit: ["Balite", "Balungao", "Buguion", "Bulusan", "Calizon", "Calumpang", "Caniogan", "Corazon", "Frances", "Gatbuca", "Gugo", "Iba Este", "Iba O'Este", "Longos", " Meysulao", "Meyto", "Palimbang", "Panducot", "Pio Cruzcosa", "Poblacion", "Pungo", "San Jose", "San Marcos", "San Miguel", "Santa Lucia", "Santo Niño", "Sapang Bayan", "Sergio Bayan"],
                DRT: ["Bayabas", "Kabayunan", "Camachin", "Camachile", "Kalawakan", "Pulong Sampalok", "Talbak"],
                Guiguinto: ["Abangan Norte", "Abangan Sur", "Ibayo", "Lambakin", "Lias", "Loma de Gato", "Nagbalon", "Patubig", "Poblacion I", "Poblacion II", "Prenza I", "Prenza II", "Santa Rosa I", "Santa Rosa II", "Saog", "Cutcut", "Daungan", "Ilang‑Ilang", "Malis", "Panginay", "Poblacion", "Pritil", "Pulong Gubat", "Santa Cruz", "Santa Rita", "Tabang", "Tabe", "Tiaong"],
                Hagonoy: ["Abulalas", "Carillo", "Iba", "Mercado", "Palapat", "Pugad", "Sagrada Familia", "San Agustin", "San Isidro", "San Jose", "San Juan", "San Miguel", "San Nicolas", "San Pablo", "San Pascual", "San Pedro", "San Roque", "San Sebastian", "Santa Cruz", "Santa Elena", "Santa Monica", "Santo Niño (Poblacion)", "Santo Rosario", "Tampok", "Tibaguin"],
                Malolos: ["Anilao", "Atlag", "Babatnin", "Bagna", "Bagong Bayan", "Balayong", "Balite", "Bangkal", "Barihan", "Bulihan", "Bungahan", "Caingin", "Calero", "Caliligawan", "Canalate", "Caniogan", "Catmon", "Cofradia", "Dakila", "Guinhawa", "Ligas", "Liang", "Longos", "Look 1st", "Look 2nd", "Lugam", "Mabolo", "Mambog", "Masile", "Matimbo", "Mojon", "Namayan", "Niugan", "Pamarawan", "Panasahan", "Pinagbakahan", "San Agustin", "San Gabriel", "San Juan", "San Pablo", "San Vicente (Poblacion)", "Santiago", "Santisima Trinidad", "Santo Cristo", "Santo Niño (Poblacion)", "Santo Rosario (Poblacion)", "Santor", "Sumapang Bata", "Sumapang Matanda", "Taal", "Tikay"],
                Marilao: ["Abangan Norte", "Abangan Sur", "Ibayo", "Lambakin", "Lias", "Loma de Gato", "Nagbalon", "Patubig", "Poblacion I", "Poblacion II", "Prenza I", "Prenza II", "Santa Rosa I", "Santa Rosa II", "Saog"],
                Meycauayan: ["Bagbaguin", "Bahay Pare", "Bancal", "Banga", "Bayugo", "Caingin", "Calvario", "Camalig", "Hulo", "Iba", "Langka", "Lawa", "Libtong", "Liputan", "Longos", "Malhacan", "Pajo", "Pandayan", "Pantoc", "Perez", "Poblacion", "Saluysoy", "Saint Francis (Gasak)", "Tugatog", "Ubihan"]
            };
            if (BarangayByCategory.hasOwnProperty(municipal)) {
                return resolve(BarangayByCategory[municipal].includes(barangay));
            }
            else {
                return resolve(false);
            }
        });
    }
    catch (e) {
        return reject(false);
    }
    
}


module.exports = {
    checkadminCount,
    checkadmin,
    create_Admin_Account,
    encrypt,
    jwt_stat,
    isRegister,
    info,
    checkToken,
    redirectToadmin,
    create_temp_account,
    userTempInfo,
    deleteTempAccount,
    isExist,
    users,
    createMillionRecord,
    listUsers,
    UpdateAdmin,
    Block_Unblock_Account,
    ForceVerified,
    DeleteAcc,
    Location
}
