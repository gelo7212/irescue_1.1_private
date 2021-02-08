const databaseHelper = require('../databaseHelper/databaseHelper')
var url = require('url');
const fs = require('fs');
var path = require('path');
var Log = require('../logger/log')
async function find(_ID){
    return new Promise((resolve,reject)=>{
        const pool =databaseHelper.pool
        const promisePool =pool.promise();
        let str = databaseHelper.mysql2Promise.escape(_ID)
        promisePool.query('SELECT * FROM `post_links` WHERE ID = '+str).then(([result,field])=>{
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
async function remove(_ID){
    try {
        return new Promise((resolve, reject) => {
            let query = 'DELETE FROM `post_links` WHERE `POST_ID` = ?';
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
async function create(data){
    return new Promise((resolve,reject)=>{
        let query = "INSERT INTO post_links (ID,FILENAME,PATH,FILETYPE,POST_ID) VALUES ?";
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
    }).catch((err)=>{
        console.log(err)
        Log.error({
            level: 'error',
            message: err.message +' '+ Date.now()
        });
    })
}
async function link_arr(links,p_id){
    return new Promise((resolve, reject) => {
        let ret_arr = [];
        if (typeof links == 'undefined' ||  Object.keys(links).length == 0) {
            return resolve ({
                l:0
            })
        }
        Object.keys(links).forEach(function (element) {
            ret_arr.push([null, links[element].filename, links[element].path, links[element].mimetype, p_id]);
        });
        
        return resolve(ret_arr);
    }).catch (err=> {
        console.log(err);
        Log.error({
            level: 'error',
            message: err.SyntaxError +' '+ Date.now()
        });
        return false
    });
  
}
async function rem_file(files){
    try {
        return new Promise((resolve, reject) => {
            if (typeof links == 'undefined' ||  Object.keys(links).length == 0) {
                return resolve ({
                    l:0
                })
            }
            Object.keys(files).forEach(function (element) {
                fs.unlink(path.join(__dirname,'../../', files[element].path), err => {
                    if (err){
                        console.log(err);
                        return reject(false);
                    }
                    console.log(files[element].path)
                });
            });
            return resolve(true);
        }).catch (err=> {
            console.log(err);
            Log.error({
                level: 'error',
                message: err.SyntaxError +' '+ Date.now()
            });
            return false
        });
    }
    catch (err) {
        console.log(err);
        Log.error({
            level: 'error',
            message: err.message +' '+ Date.now()
        });
        return false
    }
}
module.exports ={
    create,
    find,
    remove,
    link_arr,
    rem_file
}