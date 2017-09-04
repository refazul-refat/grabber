var host_url = 'https://128.199.85.2/treehouse/';
var timer1;
var timer2;
var timer3;

console.log(host_url);

if (location.href.split('/library/').length > 1) {
    clearInterval(timer1);
    clearInterval(timer2);
    clearInterval(timer3);
    timer1 = setInterval(function() {
        if ($('video source[type="video/mp4"]')[0]) {
            clearInterval(timer1);
            clearInterval(timer2);
            clearInterval(timer3);
            download_video();
        }
    }, 1000);
    timer2 = setInterval(function() {
        if ($('.featurette ul a').length > 0) {
            clearInterval(timer1);
            clearInterval(timer2);
            clearInterval(timer3);
            open_links_1();
        }
    }, 1000);
    timer3 = setInterval(function() {
        if ($('#workshop-videos li a').length > 0) {
            clearInterval(timer1);
            clearInterval(timer2);
            clearInterval(timer3);
            open_links_2();
        }
    }, 1000);
}
function open_links_1() {
    $('.featurette ul a').each(function(a, b) {
        var class_names = $(b).find('> svg').attr('class');
        if (class_names && (class_names.indexOf('video-22-icon') > -1 || class_names.indexOf('complete-outline-icon') > -1)) {
            var url = window.location.origin + b.getAttribute('href');
            console.log(url);
            send_message_to_background({greeting: 'create_new_tab', url: url});
        };
    });
}
function open_links_2() {
    $('#workshop-videos li a').each(function(a, b) {
        var url = window.location.origin + b.getAttribute('href');
        console.log(url);
        send_message_to_background({greeting: 'create_new_tab', url: url});
    });
}

function download_video() {
    var dir_name = location.href.split('/library/')[1];
    var mp4_source = $('video source[type="video/mp4"]').attr('src');
    console.log(dir_name, mp4_source);
    $.ajax({
        url: host_url + 'download',
        method: 'POST',
        data: {
            dir_name: dir_name,
            mp4_source: mp4_source
        },
        success: function() {
            window.close();
        }
    });
}

function send_message_to_background(message, callback) {
    chrome.runtime.sendMessage(message, function(response_ext) {
        if (typeof callback === 'function') {
            callback(response_ext);
        }
    });
}
