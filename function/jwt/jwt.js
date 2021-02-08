var jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require('path');
const util = require('util');
const readFileSync = util.promisify(fs.readFile);

function getPubKey(){
    return new Promise((resolve,reject)=>{
         readFileSync(path.join(__dirname+'/../../', '/key/jwtRS256.key.pub')).then(val=>{
            resolve(val)
         })
        
    }).catch(err=>{
        console.log(err)
    })
   
}
async function getPrivKey(){
    return new Promise((resolve,reject)=>{
        readFileSync(path.join(__dirname+'/../../', '/key/jwtRS256.key')).then(val=>{
            resolve(val)
         })
        
    }).catch(err=>{
        console.log(err)
    })

}
function encrypt(data,expiresIn){
    return new Promise((resolve,reject)=>{
        getPrivKey().then(privateKey=>{
            console.log('encrypt ',data)
            //console.log(privateKey)
            jwt.sign(data, privateKey, { algorithm: 'RS256' ,expiresIn: expiresIn },(err,token)=>{
                if(err) return reject(err)
                console.log('encrypt result ',token)
                resolve(token)
            })
        })       
    }).catch((err)=>{
        console.log(err)
        return false
    })
   
}
function decrypt(token){
    return new Promise((resolve , reject)=>{
        getPubKey().then(pubKey=>{
            console.log(token)
            let opts = {
                algorithms: ["RS256"]
            }
            jwt.verify(token, pubKey,opts,(err,decoded)=>{
                if(err) return reject(err)
                console.log('decoded result ',decoded)
                resolve(decoded)
            })
        })
        
    }).catch((err)=>{
        console.log(err)
        return false
    })
}   

module.exports ={ encrypt , decrypt}