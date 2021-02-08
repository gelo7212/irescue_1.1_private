"use strict";
$(document).ready(function() { 
    $("#signin").click(function(e) {
        console.log('click')
        e.preventDefault();
        $("#signin").empty().append( '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>'+
                                                    'Loading...').attr('disabled','disabled');
         $( ".alert" ).alert('close')
        $.ajax({
            type: 'POST',
            url: '/auth/user',
            data: $('form').serialize(),
            success: function(data) {
                if(data.authorized){
                    window.location.replace('/')
                }else{
                    $( ".alert_cont" ).empty().append( $( data ) );
                    $("#signin").empty().removeAttr('disabled').text('Sign in')
                }
             
            },
            error: function() {
                console.log("Signup was unsuccessful");
            }
        });
    });
})
