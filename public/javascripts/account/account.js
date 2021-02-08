"use strict";
$(document).ready(function() { 
    window.interval_ = false;
    $("#create_link").click(function(e) {
        console.log('click')
        e.preventDefault();
        $("#create_link").empty().append( '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>'+
                                                    'Loading...').attr('disabled','disabled');
         //$( ".alert" ).alert('close')
        $.ajax({
            type: 'POST',
            url: '/account/create-link',
            data: $('form').serialize(),
            success: function(data) {
                console.log(data)
                if(data.success === true){
                    $( ".alert_cont" ).empty().append( $( data ) );
                    $("#create_link").empty().removeAttr('disabled').text('Create Link')
                   
                }else{
                    $( ".alert_cont" ).empty().append( $( data ) );
                    $("#create_link").empty().removeAttr('disabled').text('Create Link')
                   
                }
                
            },
            error: function() {
                console.log("Signup was unsuccessful");
                $("#create_link").empty().removeAttr('disabled').text('Create Link')
              
            }
        });
    });
    
    $("#exampleModalCenter").on('click','#saveChanges', function(e) {
        console.log('click')
        e.preventDefault();
        $("#saveChanges").empty().append( '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>'+
                                                    'Loading...').attr('disabled','disabled');
         //$( ".alert" ).alert('close')
        $.ajax({
            type: 'POST',
            url: '/account/admin/update',
            data: $('#updateForm').serialize(),
            success: function(data) {
                console.log(data)
                $( ".alert_cont2" ).empty().append( $( data ) );
                $("#saveChanges").empty().removeAttr('disabled').text('Save changes')
                let _ID = $('#custId').val()
                user(_ID).then(d=>{
                    let data =''
                    var Municipal
                    var Barangay
                    if(d.Account_Barangay != 'N/A')  
                        Barangay = d.Account_Barangay
                    else 
                        Barangay = ""
                    if(d.Account_Municipal != 'N/A' ) 
                        Municipal = d.Account_Municipal
                    else
                        Municipal = ""
                    if(d.Account_DISABLE)
                        data ='<tr  class="table-danger" ><th class="fitwidth" scope="row">'+d.Account_ID+'</th><td class="fitwidth">'+d.Account_NAME+'</td><td class="fitwidth">'+d.Account_USERNAME+'</td><td class="fitwidth">'+d.Account_Province+' '+ Municipal+' '+Barangay+'</td><td class="fitwidth"> '+d.Account_EMAIL+'</td><td class="fitwidth"> '+d.Account_TYPE_ID+'</td><td class="fitwidth"> <div class="btn-group-sm mr-2" role="group" aria-label="Third group"><button class="btn btn-secondary" type="button">edit</button><button class="btn btn-secondary" type="button">More</button></div></td> </tr>'
                    else
                       data = '<tr><th class="fitwidth" scope="row">'+d.Account_ID+'</th><td class="fitwidth">'+d.Account_NAME+'</td><td class="fitwidth">'+d.Account_USERNAME+'</td><td class="fitwidth">'+d.Account_Province+' '+ Municipal+' '+Barangay+'</td><td class="fitwidth"> '+d.Account_EMAIL+'</td><td class="fitwidth"> '+d.Account_TYPE_ID+'</td><td class="fitwidth"> <div class="btn-group-sm mr-2" role="group" aria-label="Third group"><button class="btn btn-secondary" type="button">edit</button><button class="btn btn-secondary" type="button">More</button></div></td> </tr>'
                    
                    $('#logsTable tbody tr').find('th').filter(function() {
                        $('.alert button.close').hide()
                        $('.modal-footer #closebtn').empty().text('Close')
                        
                        $('.modal-footer button#BanBtn').hide()
                        return $(this).text() == _ID;
                    }).parent().replaceWith(data)
                })
                
                
            },
            error: function() {
                console.log("Signup was unsuccessful");
                $("#saveChanges").empty().removeAttr('disabled').text('Save changes')
              
            }
        });
    }).on('click','#DeleteBtn', function(e) {
        console.log('click')
        e.preventDefault();
        $("#DeleteBtn").empty().append( '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>'+
                                                    'Loading...').attr('disabled','disabled');
         //$( ".alert" ).alert('close')
         let _ID = $('#del_id').text()
         $.ajax({
            type: 'DELETE',
            url: '/account/admin',
            data:{_ID: _ID},
            success: function(data) {
                console.log(data)
                //$( ".alert_cont2" ).empty().append( $( data ) );
                $('.modal-body').empty().append(data)
                
                $('#logsTable tbody tr').find('th').filter(function() {
                    $('.alert button.close').hide()
                    $("#DeleteBtn").empty().removeAttr('disabled').text('Delete').hide()
                    $('.modal-footer #closebtn').empty().text('Close')
                    $('.alert button.close').hide()
                    
                    $('.modal-footer button#BanBtn').hide()
                    return $(this).text() == _ID;
                }).parent().remove()
                
            },
            error: function() {
                console.log("Signup was unsuccessful");
                $("#DeleteBtn").empty().removeAttr('disabled').text('Delete')
            
            }
        });
    }).on('click','#BanBtn', function(e) {
        console.log('click')
        e.preventDefault();
        $("#BanBtn").empty().append( '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>'+
                                                    'Loading...').attr('disabled','disabled');
        //$( ".alert" ).alert('close')
        let _ID = $('#del_id').text(),s = $('#searchState').val(),dt = new Date(),l =''
        
        if( s=='C')
            l = $('#long_').val()
         $.ajax({
            type: 'PUT',
            url: '/account/admin',
            data:{
                _ID: _ID,
                s:s,
                d:`${dt.getFullYear().toString().padStart(4, '0')}-${
                    (dt.getMonth()+1).toString().padStart(2, '0')}-${
                    dt.getDate().toString().padStart(2, '0')} ${
                    dt.getHours().toString().padStart(2, '0')}:${
                    dt.getMinutes().toString().padStart(2, '0')}:${
                    dt.getSeconds().toString().padStart(2, '0')}`,
                l:l
            },
            success: function(data) {
                console.log(data)
                //$( ".alert_cont2" ).empty().append( $( data ) );
                user(_ID).then(d=>{
                    if ('A' == s){
                        let data =''
                        var Municipal
                        var Barangay
                        if(d.Account_Barangay != 'N/A')  
                            Barangay = d.Account_Barangay
                        else 
                            Barangay = ""
                        if(d.Account_Municipal != 'N/A' ) 
                            Municipal = d.Account_Municipal
                        else
                            Municipal = ""
                        if(d.Account_DISABLE)
                        {
                            $('.modal-footer button#BanBtn').text('Enable Account')
                            data ='<tr  class="table-danger" ><th class="fitwidth" scope="row">'+d.Account_ID+'</th><td class="fitwidth">'+d.Account_NAME+'</td><td class="fitwidth">'+d.Account_USERNAME+'</td><td class="fitwidth">'+d.Account_Province+' '+ Municipal+' '+Barangay+'</td><td class="fitwidth"> '+d.Account_EMAIL+'</td><td class="fitwidth"> '+d.Account_TYPE_ID+'</td><td class="fitwidth"> <div class="btn-group-sm mr-2" role="group" aria-label="Third group"><button class="btn btn-secondary" type="button">edit</button><button class="btn btn-secondary" type="button">More</button></div></td> </tr>'
                        }
                        else
                        {
                            $('.modal-footer button#BanBtn').text('Ban/Disable')
                            data = '<tr><th class="fitwidth" scope="row">'+d.Account_ID+'</th><td class="fitwidth">'+d.Account_NAME+'</td><td class="fitwidth">'+d.Account_USERNAME+'</td><td class="fitwidth">'+d.Account_Province+' '+ Municipal+' '+Barangay+'</td><td class="fitwidth"> '+d.Account_EMAIL+'</td><td class="fitwidth"> '+d.Account_TYPE_ID+'</td><td class="fitwidth"> <div class="btn-group-sm mr-2" role="group" aria-label="Third group"><button class="btn btn-secondary" type="button">edit</button><button class="btn btn-secondary" type="button">More</button></div></td> </tr>'
                        }
                        $('#logsTable tbody tr').find('th').filter(function() {
                            $('.alert button.close').hide()
                            $('.modal-footer #closebtn').empty().text('Close')
                            return $(this).text() == _ID;
                        }).parent().replaceWith(data)
                    }else{
                        if(data){
                            console.log(data)
                            window.as('/account/modal',$('#del_id').text(),'DELETE').then(()=>{
                                
                            });
                        }else{
                            $('.modal-footer button#BanBtn').text('Ban/Disable')
                        }
                        
                    }
                    
                   
                })
                
            },
            error: function() {
                console.log("Signup was unsuccessful");
                $("#BanBtn").empty().removeAttr('disabled').text('Ban/Disable')
            
            }
        });
    })

    
})
function cct1(value){
        
    $("#formopt1 label.modal_lbl").text("Barangay")
    switch(value){
        case "CA":
            $("#form_prov1")
            $("#Selectmunicipal1").prop('disabled',true)
            $("#SelectOption1").prop('disabled',true)
            break;
        case "MA":
            $("#form_prov1")
            $("#Selectmunicipal1").prop('disabled',false)
            $("#SelectOption1").prop('disabled',true)
            break;
        case "BH":
            $("#form_prov1")
            $("#Selectmunicipal1").prop('disabled',false)
            $("#SelectOption1").prop('disabled',false)
            $("#formopt1 label.modal_lbl").text("Barangay")
            break;
        case "PS":
            $("#form_prov1")
            $("#Selectmunicipal1").prop('disabled',false)
            $("#SelectOption1").prop('disabled',false)
            $("#formopt1 label.modal_lbl").text("Police Station")
            break;
        case "AMBU":
            $("#form_prov1")
            $("#Selectmunicipal1").prop('disabled',false)
            $("#SelectOption1").prop('disabled',false)
            $("#formopt1 label.modal_lbl").text("Ambulance")
            break;
        case "FS":
            $("#form_prov1")
            $("#Selectmunicipal1").prop('disabled',false)
            $("#SelectOption1").prop('disabled',false)
            $("#formopt1 label.modal_lbl").text("Fire Stations")
            break;
    }
}

function changecat1(value){
    if (value.length == 0) {
            document.getElementById("Selectmunicipal1").innerHTML = "<option></option>";
        }
    else {
        var catOptions = "";
        for (categoryId in MunicipalByCategory[value]) {
            catOptions += "<option value="+MunicipalByCategory[value][categoryId]+">" + MunicipalByCategory[value][categoryId] + "</option>";
        }
        document.getElementById("Selectmunicipal1").innerHTML = catOptions;
    }
}
function abrngy1(value){
    if (value.length == 0) {
            document.getElementById("SelectOption1").innerHTML = "<option></option>";
        }
    else {
        var catOptions = "";
        for (categoryId in BarangayByCategory[value]) {
            catOptions += "<option>" + BarangayByCategory[value][categoryId] + "</option>";
        }
        document.getElementById("SelectOption1").innerHTML = catOptions;
    }
}
window.user = function(id){
    return new Promise((resolve,reject)=>{
        $.ajax({
        type: 'GET',
        url: '/user/admin/'+id,
        success: function(data) {
           return resolve(data)
        },
        error: function() {
           return reject(false)
        
        }
    });
    }).catch(err=>{
        console.log(err)
    })
    
}
var arr =[]
for(var i = 0; i <= $('#tableOFThis tr').length-1;i++){
    arr.push($("#tableOFThis").find('tr').eq(i).find('td').eq(1).html())

}
