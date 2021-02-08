function ValidatePassword() {
/*Array of rules and the information target*/
    $(this).popover({trigger: 'keyup', placement : 'right',html :true, content:'<div class="glyphicon glyphicon-remove" id="Length">Must be at least 7 charcters</div><div class="glyphicon glyphicon-remove" id="UpperCase">Must have atleast 1 upper case character</div> <div class="glyphicon glyphicon-remove" id="LowerCase">Must have atleast 1 lower case character</div> <div class="glyphicon glyphicon-remove" id="Numbers">Must have atleast 1 numeric character</div> <div class="glyphicon glyphicon-remove" id="Symbols">Must have atleast 1 special character</div>'})
  //  $(this).popover('show')
 
    var rules = [{
        Pattern: "[A-Z]",
        Target: "UpperCase"
      },
      {
        Pattern: "[a-z]",
        Target: "LowerCase"
      },
      {
        Pattern: "[0-9]",
        Target: "Numbers"
      },
      {
        Pattern: "[!@@#$%^&*]",
        Target: "Symbols"
      }
    ];
  
    //Just grab the password once
    var password = $(this).val();
  
    /*Length Check, add and remove class could be chained*/
    /*I've left them seperate here so you can see what is going on */
    /*Note the Ternary operators ? : to select the classes*/
    $("#Length").removeClass(password.length > 6 ? "glyphicon-remove" : "glyphicon-ok");
    $("#Length").addClass(password.length > 6 ? "glyphicon-ok" : "glyphicon-remove");
    
    /*Iterate our remaining rules. The logic is the same as for Length*/
    for (var i = 0; i < rules.length; i++) {
  
      $("#" + rules[i].Target).removeClass(new RegExp(rules[i].Pattern).test(password) ? "glyphicon-remove" : "glyphicon-ok"); 
      $("#" + rules[i].Target).addClass(new RegExp(rules[i].Pattern).test(password) ? "glyphicon-ok" : "glyphicon-remove");
        }
      }
  
      /*Bind our event to key up for the field. It doesn't matter if it's delete or not*/
$(document).ready(function() {
    $("input[name=password]").on('keyup' ,ValidatePassword)
    $("input[name=password]").on('click' ,ValidatePassword)
    $('#newEmail').on('keyup',displayKey_input)
});
function displayKey_input(){
  if(validateEmail($('#newEmail').text())){
    
  }
}
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
