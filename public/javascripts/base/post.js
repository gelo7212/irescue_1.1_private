(function () {
    let nodata = false

    $(window).scroll(function () {
        let $this = $(this)
        console.log($this.scrollTop(), $this.height(), $('main').height())
        if (($this.scrollTop() + $this.height()) >= $('main').height()) {
            prepend($this)
        }
    });
    function more(offset, keyword, sort) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: '/post/a',
                data: { 'offset': offset, 'keyword': keyword, 'sort': sort },
                success: function (data) {
                    return resolve(data)
                },
                error: function () {
                    return reject(false)
                }
            });
        }).catch(err => {
            console.log(err)
        })
    }
    var i = 0
    function prepend($this) {
        new Promise((resolve, reject) => {
            var $results = $(".news_row");
            if (!$results.data("loading")) {
                $(".news_row").after($("<p class='loading'>Loading...</p>").fadeIn('slow')).data("loading", true);
                let id = $results.find('.column').last().find('.box').last().data('num')
                if (typeof id == 'undefined') {
                    id = 0
                }
                else {
                    id = id + 1
                }

                if (!nodata) {
                    more(id, '', 'newest').then(d => {
                        if (d) {
                            if (d.length == 0) {
                                nodata = true
                                $(".news_row").after($("<p class='loading'>Loading...</p>").fadeIn('slow')).data("loading", true);
                                $(".loading").fadeOut('fast', function () {
                                    $(this).remove();
                                });
                            } else {
                                console.log(d)
                                // console.log(d['link'][0].FILENAME)
                                $(".loading").fadeOut('fast', function () {
                                    $(this).remove();
                                });
                                var aa = ''
                                d.forEach(function (element) {

                                    if ($('.column').find('#' + element.ID).length == 0) {
                                        let l = element.link
                                        if (l != null) {
                                            l = 'uploads/post_images/' + l[0].FILENAME
                                            console.log(l)
                                        }

                                        if (i == 1) {
                                            console.log(i, element.ID, 'if 1')
                                            aa = '<div class="box" id="' + element.ID + '" data-num="' + id + '" style="width:100%;background-image: url(' + l + ');background-size: cover;">' +
                                                '<div class="NewsHeading">' +
                                                '<svg class="feather feather-loader" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white;">' +
                                                '<line x1="12" y1="2" x2="12" y2="6"></line>' +
                                                '<line x1="12" y1="18" x2="12" y2="22"></line>' +
                                                '<line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>' +
                                                '<line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>' +
                                                '<line x1="2" y1="12" x2="6" y2="12"></line>' +
                                                '<line x1="18" y1="12" x2="22" y2="12"></line>' +
                                                '<line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>' +
                                                '<line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>' +
                                                '</svg>' +
                                                '<p style="font-weight: bold;color:white;">' + element.POST_TYPE + ' <br /><span style="font-weight: 100;color:white;">' + element.BODY + '</span></p>' +
                                                '</div>' +
                                                '</div>'

                                        }
                                        else if (i == 2) {
                                            console.log(i, element.ID, 'if 2')
                                            aa = aa +
                                                '<div class="box" id="' + element.ID + '"  data-num="' + id + '" style="width:100%;background-image: url(' + l + ');background-size: cover;">' +
                                                '<div class="NewsHeading">' +
                                                '<svg class="feather feather-loader" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white;">' +
                                                '<line x1="12" y1="2" x2="12" y2="6"></line>' +
                                                '<line x1="12" y1="18" x2="12" y2="22"></line>' +
                                                '<line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>' +
                                                '<line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>' +
                                                '<line x1="2" y1="12" x2="6" y2="12"></line>' +
                                                '<line x1="18" y1="12" x2="22" y2="12"></line>' +
                                                '<line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>' +
                                                '<line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>' +
                                                '</svg>' +
                                                '<p style="font-weight: bold;color:white;">' + element.POST_TYPE + ' <br /><span style="font-weight: 100;color:white;">' + element.BODY + '</span></p>' +
                                                '</div>' +
                                                '</div>'
                                            $results.append('<div class="column">' + aa + '</div>');

                                        } else {
                                            console.log(i, element.ID, 'elsse')
                                            aa = '<div class="box" id="' + element.ID + '"  data-num="' + id + '" style="width:100%;background-image: url(' + l + ');background-size: cover;">' +
                                                '<div class="NewsHeading">' +
                                                '<svg class="feather feather-loader" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white;">' +
                                                '<line x1="12" y1="2" x2="12" y2="6"></line>' +
                                                '<line x1="12" y1="18" x2="12" y2="22"></line>' +
                                                '<line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>' +
                                                '<line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>' +
                                                '<line x1="2" y1="12" x2="6" y2="12"></line>' +
                                                '<line x1="18" y1="12" x2="22" y2="12"></line>' +
                                                '<line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>' +
                                                '<line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>' +
                                                '</svg>' +
                                                '<p style="font-weight: bold;color:white;">' + element.POST_TYPE + ' <br /><span style="font-weight: 100;color:white;">' + element.BODY + '</span></p>' +
                                                '</div>' +
                                                '</div>'
                                            $results.append('<div class="column">' + aa + '</div>');
                                        }
                                        i++


                                        id++
                                    } else {
                                        console.log('exist')
                                    }

                                })
                                $results.removeData("loading");
                            }

                        }
                    })
                }
            }

        })
    }
    prepend($('.news_row'))

})()