module.exports = function(io){
    var Message = require('../message/message')
    var Thread = require('../message/thread')
    var Thread_participant = require('../message/thread_participant')
    var Admin = require('../admin/admin');
    const request = require('../main/request')
    const publicIp = require('public-ip');
    const databaseHelper = require('../databaseHelper/databaseHelper')
    const Post = require('../post/post')
    var cpu = require('../admin/server_monitor')
    var cookieParse = require('../cookie/cookie')
    var mem_interval = undefined
    let post_interval = undefined
    var clients = 0;
    var clients_request = 0;
    let connectedClient = []
    var app = require('../../app')
    var jwt = app.jwt
    let message
    let Clients = []
    let User = require('../../function/main/user')
    process.on('message', function(msg) {
              if(msg.io){
                    Clients = msg.io
                    console.log(msg.io)
                    console.log('CLIENTS',Clients)
              }
            });  
    io.use(async function(socket,next){
        var cookies =await decodeURIComponent(socket.request.headers.cookie);
        var decodedCookie =await cookieParse.getCookie('_d.r',cookies)
        if (decodedCookie){
          var decoded =await jwt.decrypt(decodedCookie)
          if(decoded!=false){
            //console.log(decoded.Account_TYPE_ID )
            if(decoded.Account_TYPE_ID == 'Super Admin' ||decoded.Account_TYPE_ID == 'CA' || decoded.Account_TYPE_ID == 'MA' ||decoded.Account_TYPE_ID == 'BH'||decoded.Account_TYPE_ID =='PS'||decoded.Account_TYPE_ID == 'AMBU'  ||decoded.Account_TYPE_ID == 'FS'){
              socket.decoded = decoded;
              //console.log(socket.decoded)
              next()
            }else{
              //
            // console.log('Not Authorized')
            }
          }else{ 
          // console.log('error')
            next(new Error('Authentication error'));
            
            //
          }
        } else {
          console.log('error')
          next(new Error('Authentication error'));
        } 
      })
      io.on('connection',async function(socket){
        
      // console.log(socket.decoded.Account_NAME)
        var total=io.engine.clientsCount;
        //onlineAdmin.set(socket.id, socket.decoded);
      // console.log(`user connected from main${socket.id}`);
      // console.log(`user total connected `,total);
        socket.emit('datetime', { datetime: new Date().getTime() });
        socket.on('disconnect', function(){
        // console.log(`user disconnected from main ${socket.id}`);
        // console.log(`user total connected `,total);
        })
        socket.on('error', (error) => {
        // console.log('WebSocket Error ' + error);
        });
      })
        message = io.of('/message')
        .on('connection',function(socket){
            var cookies =decodeURIComponent(socket.request.headers.cookie);
            var decodedCookie = cookieParse.getCookie('_d.r',cookies)
            jwt.decrypt(decodedCookie).then(async decoded=>{  
                process.send({
                    io:{
                      io_id:socket.id,
                      _id:decoded.Account_ID,
                      options:'add'
                    }
                }) 
                socket.decoded = decoded;
                socket.on('send To',function(msg){
                    console.log('msg',msg)
                    let to = msg.to
                    Message.findOnMessageAndThreadParticipantByUserID(to,decoded.Account_ID,0).then(mess_result=>{
                      if(mess_result.length == 0){
                        Thread.create().then(id=>{
                          Thread_participant.create(id,decoded.Account_ID).then(tp_id=>{
                            Thread_participant.create(tp_id,to).then(tp_id2=>{
                              Message.send(tp_id2,msg.body,decoded.Account_ID).then(mess_ID=>{
                                User.search(msg.to,Clients,'_ID').then(result=>{
                                  result.forEach(function(element) {
                                    console.log(element);
                                    if(typeof element != 'undefined'){
                                      console.log('CLIENTS',Clients)
                                      socket.broadcast.to(element.io_ID).emit('my message', {body:msg.body,from:decoded.Account_ID,mess_id:mess_ID});
                                    }
                                  });
                                  socket.emit('my message', {body:msg.body,from:'me',mess_id:mess_ID});
                                })
                              })
                            })
                          })
                        })
                      }else{
                        Message.send(mess_result[0].THREAD_ID,msg.body,decoded.Account_ID).then(mess_ID=>{
                          User.search(msg.to,Clients,'_ID').then(result=>{
                            result.forEach(function(element) {
                              console.log(element);
                              if(typeof element != 'undefined'){
                                console.log('CLIENTS',Clients)
                                socket.broadcast.to(element.io_ID).emit('my message', {body:msg.body,from:decoded.Account_ID,mess_id:mess_ID});
                              }
                            });
                            socket.emit('my message', {body:msg.body,from:'me',mess_id:mess_ID});
                          })
                        })
                      }
                    })
                    
                })
                socket.on('disconnect', () => {
                    process.send({
                        io:{
                            io_id:socket.id,
                            _id:decoded.Account_ID,
                            options:'del'
                        }
                    }) 
                });
            })
        }) 
      var memory = io ,online = io ,request_io = io
      let memIo = memory.of('/memory')
        .on('connection',async function(socket){
          clients++;
          if(typeof mem_interval === 'undefined'){
            mem_interval =await setInterval( function(){
              var tm =  cpu.totalmem()
              var fm =  cpu.freemem()
              cpu.CPU().then((result) => {
                memIo.local.emit('memory',{
                  totalmem:tm,
                  freemem:fm,
                  cpuPercentage:result
                })
              }).catch((err) => {
                throw (err)
              });
            }, 5000);
          }
          socket.on('disconnect', () => {
            clients--;
            if(clients==0){
              clearInterval(mem_interval)
              mem_interval = undefined;
              clearInterval(request_interval)
              request_interval = undefined;
              
            }
            //onlineAdmin.delete(socket.id);
          });
        })
        let request_interval 
        let rio = request_io.of('/request')
        .on('connection', function(socket){
          if(typeof request_interval == 'undefined'){
              
            request_interval = setInterval(() => {
              request.count(1).then(cnt=>{
                //console.log(cnt , request.requests.length , new Date())
                
                rio.local.emit('request',{
                  data: cnt
                });
              })
            },1000);
            
          }
          socket.on('disconnect', () => {
            
          });
        })
      let ololio =online.of('/online_user')
        .on('connection',function(socket){
          
          var cookies =decodeURIComponent(socket.request.headers.cookie);
          
          var decodedCookie = cookieParse.getCookie('_d.r',cookies)
          jwt.decrypt(decodedCookie).then(async decoded=>{   
            console.log('new online ',decodedCookie)
            let onlineAdmin = {};             
            socket.decoded = decoded;
            if (await publicIp.v4()){
              console.log('ip_is',await publicIp.v4())
              socket.decoded.ip = await publicIp.v4()
            }else{
              console.log('ip_is',await publicIp.v4())
              socket.decoded.ip = ''
            }
            
            process.send({user: socket.decoded , id:socket.id})
            process.on('message', function(msg) {
              if(msg.users){
                socket.emit('online_user',msg.users)
                socket.broadcast.emit('online_user',msg.users)
              }
            });              
            
            socket.on('disconnect', () => {
              process.send({del_user: socket.decoded , id:socket.id})
              process.on('message', function(msg) {
                  if(msg.users){
                    socket.emit('online_user',msg.users)
                    socket.broadcast.emit('online_user',msg.users)
                  }
                })
            });
          })
        })
        let last_data = undefined 
        let com_data = undefined
        let oPost = online.of('/post')
          .on('connection',function(socket){
            var cookies =decodeURIComponent(socket.request.headers.cookie);
            var decodedCookie = cookieParse.getCookie('_d.r',cookies)
            jwt.decrypt(decodedCookie).then(decoded=>{
              if(typeof post_interval === 'undefined'){
                post_interval = setInterval( function(){
                  Post.hasNew().then(data=>{
                    com_data = data[0].ID
                    if(typeof last_data == 'undefined'){
                      last_data = data[0].ID
                    }
                    if(last_data != com_data){
                      console.log('new Data')
                      last_data = undefined
                      oPost.local.emit('post',{
                        data:data
                      })
                    }
                  })
                }, 1000);
              }
            })
            socket.on('disconnect', () => {
            
              //onlineAdmin.delete(socket.id);
            });
          })
}
