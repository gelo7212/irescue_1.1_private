
$(document).ready(function() {
    var online_user = io.connect('/online_user',{
        
        query: {token: getCookie('_d.r')},
        transports: [ 'websocket' ]
    });
    online_user.on('connect', function () {
        console.log('User connected!');
    });
    online_user.on('online_user', function (result) {
        var result_ID = []
       console.log(result)
       $( "#admin-con" ).empty()
        for (var key in result) {
            if( $( "#admin-con" ).has(result[key].Account_ID).length== 0){
                if(!result_ID.includes(result[key].Account_ID)){
                    result_ID.push(result[key].Account_ID)
                    if($( "#admin-con" ).has('#'+result[key].Account_ID)){
                        $( "#admin-con" ).prepend('<li class="nav-item" id ="'+result[key].Account_ID+'" >'+
                                                            '<div class="media text-muted pt-3 nav-link" onclick = "popUpChatBox('+result[key].Account_ID+');" id="'+result[key].Account_ID+'" data-location="'+result[key].Account_LOCATION+'" data-level="'+result[key].Account_TYPE_ID+'" >'+
                                                                
                                                                '<div class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">'+
                                                                    '<div class="d-flex justify-content-between align-items-center w-100"><strong class="text-gray-dark">'+result[key].Account_NAME+'</strong></div><a href="javascript:void(0)">'+(typeof result[key].Account_Municipal !='undefined' && result[key].Account_Municipal != 'N/A'?result[key].Account_Municipal: result[key].Account_Province)+' '+ (typeof result[key].Account_Barangay != 'undefined' && result[key].Account_Barangay !='N/A' ?result[key].Account_Barangay :'') + '</a><span class="d-block">'+result[key].Account_TYPE_ID+ '</span><span class="d-block">'+result[key].ip+ '</span>'+
                                                                '</div>'+
                                                            '</div>'+
                                                    ' </li> ');
                    }
                    console.log(result[key].Account_NAME);
                }
            }
                
        }
    });    
    var socket1 = io.connect('/post',{
        query: {token: getCookie('_d.r')}
    });
    socket1.on('connect', function () {
        console.log('User connected!');
    });
      socket1.on('post', function (result) {
        console.log(result.data)
        dsh_app(result.data)
    });  
    var message = io('/message',{
        query: {token: getCookie('_d.r')}
    });
    message.on('connect',function(){
         console.log('User can now recieved message!');
    })
    message.on('my message',function(msg){
        console.log(msg)
        var $chatbox = $('#frame_')
        if(msg.from =='me'){
            let html = '<li class="replies" id= "'+msg.mess_id+'"><img src="http://emilcarlsson.se/assets/harveyspecter.png" alt=""><p>'+msg.body+'</p></li>'
            $('#frame_').find('.messages').find('ul').append(html)
            $chatbox.find('.msg').val('')
        }else{
            if($('#frame_').find('.content').length == 0 || $('#frame_').find('#frame').find('.contact-profile').data('id') != msg.from && $chatbox.find('.msg').val() == ''){
                popUpChatBox(msg.from)
            }else{
                let html = '<li class="sent" id= "'+msg.mess_id+'"><img src="http://emilcarlsson.se/assets/harveyspecter.png" alt=""><p>'+msg.body+'</p></li>'
                $('#frame_').find('.messages').find('ul').append(html)
            }
        }
        setTimeout(function(){
            $chatbox.find('.messages').animate({ scrollTop: $( $chatbox ).find('.messages').find('ul').find('li:last-child').position().top}, 1000);
        },2000)
    })
    $('#frame_').on('click' ,'.submit',function(){
        console.log('send',$('#frame_').find('.msg').val(),$('#frame_').find('.contact-profile').data('id'))
        message.emit('send To',{body:$('#frame_').find('.msg').val(),to:$('#frame_').find('.contact-profile').data('id')})
    })
})
var d_chatb = undefined
function chatboxOnScroll(){
    if(typeof d_chatb == 'undefined'){
        console.log('top ')
        d_chatb = true
    }
}

let threads =function(){
     $.post('/message/chat-thread',{'OFFSET':0 },function(data){
        let $navbar = $('nav')
        console.log(data)
        for(let a in data){
            console.log(data[a])
            $navbar.find('.navbar-nav').find('.message_thread').find('.dropdown-list').find('h6').after(
                '<a class="dropdown-item d-flex align-items-center" onclick=popUpChatBox('+data[a].SENDING_USER_ID+') href="javascript:void(0)"> '+
                '<div class="dropdown-list-image mr-3"><img class="rounded-circle" src="https://source.unsplash.com/CS2uCrpNzJY/60x60" alt="" /> '+
                  '<div class="status-indicator bg-warning"></div> '+
                '</div> '+
                '<div> '+
                  '<div class="text-truncate">'+data[a].BODY+'</div> '+
                  '<div class="small text-gray-500">'+data[a].Account_NAME+' '+data[a].SEND_DATE+'</div> '+
               ' </div> '+
              '</a>'
            )
        }
        //
        
    })
}
    threads()
window.loadMessages = function(TO_USER, OFFSET ){
    var $chatbox = $('#frame_')
    $.post('/message/t',{'TO_USER':TO_USER, 'OFFSET':OFFSET },function(data){
        $( $chatbox ).find('.messages').find('ul').prepend( data );
        $( $chatbox ).find(".loading").fadeOut('fast', function() {
            $(this).remove();
        });
        $( $chatbox ).find('.messages').removeData("loading");
    })
}
function popUpChatBox(id){
    var $chatbox = $('#frame_')
    $chatbox.empty()
    $.post('/message/chat-box',{id:id},function(data){
    $( $chatbox ).html( data );
    loadMessages(id,0)
    setTimeout(function(){
        $chatbox.find('.messages').animate({ scrollTop: $( $chatbox ).find('.messages').find('ul').find('li:last-child').position().top }, 1000);
    },2000)
    })
}
function loadMessage(){
    $.post('/message/chat-box',function(data){
        $( $chatbox ).html( data );
    })
}
window.Users = function(){
    
}