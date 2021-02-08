var databaseHelper = require('../databaseHelper/databaseHelper')
function getMessageThread(req,res,next){
    var query = databaseHelper.connection.query('SELECT * FROM posts');
    query.on('error', function(err) {
        // Handle error, an 'end' event will be emitted after this as well
    })
    .on('fields', function(fields) {
        // the field packets for the rows to follow
    })
    .on('result', function(row) {
        // Pausing the connnection is useful if your processing involves I/O
        res.render('includes/message/chat_box', { title: 'Express' ,authorized:true,Account_TYPE_ID:token.Account_TYPE_ID});
        connection.pause();
    
        processRow(row, function() {
        connection.resume();
        });
    })
    .on('end', function() {
        // all rows have been received
    });
}
function getMessageByThread(req,res,next){
    var query = databaseHelper.connection.query('SELECT * FROM posts');
    query.on('error', function(err) {
        // Handle error, an 'end' event will be emitted after this as well
    })
    .on('fields', function(fields) {
        // the field packets for the rows to follow
    })
    .on('result', function(row) {
        // Pausing the connnection is useful if your processing involves I/O
        res.render('includes/message/chat_box', { title: 'Express' ,authorized:true,Account_TYPE_ID:token.Account_TYPE_ID});
        connection.pause();
    
        processRow(row, function() {
        connection.resume();
        });
    })
    .on('end', function() {
        // all rows have been received
    });
}
function getMessageInAllThread(req,res,next){
    var query = databaseHelper.connection.query('SELECT * FROM posts');
    query.on('error', function(err) {
        // Handle error, an 'end' event will be emitted after this as well
    })
    .on('fields', function(fields) {
        // the field packets for the rows to follow
    })
    .on('result', function(row) {
        // Pausing the connnection is useful if your processing involves I/O
        res.render('includes/message/chat_list', { title: 'Express' ,authorized:true,Account_TYPE_ID:token.Account_TYPE_ID});
        connection.pause();
    
        processRow(row, function() {
        connection.resume();
        });
    })
    .on('end', function() {
        // all rows have been received
    });
}
function getMessageByUserAndReciever(req,res,next){
    var query = databaseHelper.connection.query('SELECT * FROM posts');
    query.on('error', function(err) {
        // Handle error, an 'end' event will be emitted after this as well
    })
    .on('fields', function(fields) {
        // the field packets for the rows to follow
    })
    .on('result', function(row) {
        // Pausing the connnection is useful if your processing involves I/O
        res.render('includes/message/chat_box', { title: 'Express' ,authorized:true,Account_TYPE_ID:token.Account_TYPE_ID});
        connection.pause();
    
        processRow(row, function() {
        connection.resume();
        });
    })
    .on('end', function() {
        // all rows have been received
    });
}
function sendMessage(req,res,next){
    var query = databaseHelper.connection.query('SELECT * FROM posts');
    query.on('error', function(err) {
        // Handle error, an 'end' event will be emitted after this as well
    })
    .on('fields', function(fields) {
        // the field packets for the rows to follow
    })
    .on('result', function(row) {
        // Pausing the connnection is useful if your processing involves I/O
        res.render('includes/message/chat_box', { title: 'Express' ,authorized:true,Account_TYPE_ID:token.Account_TYPE_ID});
        connection.pause();
    
        processRow(row, function() {
        connection.resume();
        });
    })
    .on('end', function() {
        // all rows have been received
    });
}
module.exports = {getMessageThread,getMessageByThread,getMessageByUserAndReciever,getMessageInAllThread,sendMessage}