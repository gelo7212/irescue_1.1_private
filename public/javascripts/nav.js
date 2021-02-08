$('#admin').click(function(){
    $('#admin-con').toggle(500,function(){

    })
    //$( "#admin-con" ).addClass( "show" );
})
$('.nav-item').find('a').click(function(){
    $(this).parent().find('ul').toggle(500,function(){

    })
    //$( "#admin-con" ).addClass( "show" );
})
    