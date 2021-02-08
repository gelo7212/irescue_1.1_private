function dOM(element, thisLink) {
    new Promise((resolve, reject) => {
        var request = $.ajax({
            type: 'POST',
            url: '/' + thisLink,
            data: $('form').serialize(),
            beforeSend: function () {
                $("main").empty().append($('<div class="d-flex justify-content-center" style="top: 44vh; position: inherit;">' +
                    '<div class="spinner-grow" style="width: 6rem; height: 6rem;" role="status">' +
                    '<span class="sr-only">Loading...</span>' +
                    ' </div>' +
                    '</div>'));
            }
        });
        request.done(function (data) {
            $(window).off("scroll");
            if (thisLink != 'Dashboard') {
                if (typeof socket_memory != 'undefined') {
                    socket_memory.disconnect()
                    console.log('disconnected onclkc')
                }

            }
            if (thisLink == 'Dashboard') {
                if (typeof socket_memory != 'undefined') {
                    socket_memory.disconnect()
                    console.log('disconnected onclkc')
                    socket_memory.on('reconnect', (attemptNumber) => {
                        console.log('reconnect', attemptNumber)
                    });
                }

            }
            history.pushState(null, '', '/' + thisLink);
            SANS(thisLink)
            $("main").empty().append($(data));
        })
        request.fail(function (daxhr, status, data) {
            SANS(thisLink)
            $("main").empty().append($(daxhr.responseText));
        })
    })

}
function SANS(active) {
    $(".nav-link").removeClass("active");
    $(".nav-link").removeClass("disabled");
    if (active.toLowerCase() == 'Dashboard'.toLowerCase()) {
        $("#a_dashboard").addClass("active disabled");
    } else if (active.toLowerCase() == 'Map'.toLowerCase()) {
        $("#a_map").addClass("active disabled");
    } if (active.toLowerCase() == 'Account'.toLowerCase()) {
        $("#a_account").addClass("active disabled");
    } if (active.toLowerCase() == 'POST'.toLowerCase()) {
        $("#a_post").addClass("active disabled");
    } if (active.toLowerCase() == 'report'.toLowerCase()) {
        $("#a_report").addClass("active disabled");
    } 
    console.log(active)
}