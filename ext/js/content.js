var host_url = 'https://139.59.118.97/grabber/';

console.log(host_url);

if (location.href.indexOf('teamtreehouse.com') > -1) {
    var timer1;
    var timer2;
    var timer3;
    if (location.href.split('/library/').length > 1) {
        clearInterval(timer1);
        clearInterval(timer2);
        clearInterval(timer3);
        timer1 = setInterval(function() {
            if ($('video source[type="video/mp4"]')[0]) {
                clearInterval(timer1);
                clearInterval(timer2);
                clearInterval(timer3);
                treehouse_download_video();
            }
        }, 1000);
        timer2 = setInterval(function() {
            if ($('.featurette ul a').length > 0) {
                clearInterval(timer1);
                clearInterval(timer2);
                clearInterval(timer3);
                treehouse_open_links_1();
            }
        }, 1000);
        timer3 = setInterval(function() {
            if ($('#workshop-videos li a').length > 0) {
                clearInterval(timer1);
                clearInterval(timer2);
                clearInterval(timer3);
                treehouse_open_links_2();
            }
        }, 1000);
    }
} else if (location.href.indexOf('lynda.com') > -1) {
    // Lynda
    // https://lynda_files2-a.akamaihd.net/secure/courses/167065/VBR_MP4h264_main_SD/167065_02_02_MM30_how.mp4?c3.ri=3774749779903443748&hashval=1504645074_d1e97d2edd2779a158ed9b0e1763583f
    var timer1;
    clearInterval(timer1);
    timer1 = setInterval(function() {
        $('video').each(function() {
            var mp4_source = $(this).attr('data-src');
            if (mp4_source && mp4_source.indexOf('/secure/courses/') > -1) {
                clearInterval(timer1);
                var dir_name = lynda_dir_name_get(this);
                lynda_post_video(dir_name, mp4_source);
            }
        });
    }, 1000);
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.greeting == "lynda_open_links")
            sendResponse({status: "Opening Links"});
        lynda_open_links();
    });
}
function lynda_dir_name_get(video_element) {
    var dir_name = false;
    var video_info = JSON.parse($(video_element).attr('data-conviva'));
    if (video_info && parseInt(video_info.VideoId) > 0) {
        var video_id = video_info.VideoId;
        var course_title = video_info.CourseTitle;
        var chapter_title = $('#sidebar .toc-video-item[data-video-id="' + video_id + '"]').parent().siblings('.chapter-row').find('[data-ga-label="toc-chapter"]').text();
        var video_title = ($('#sidebar .toc-video-item[data-video-id="' + video_id + '"]').prevAll().length + 1) + '. ' + video_info.VideoTitle;
        var dir_name = course_title + '/' + chapter_title + '/' + video_title;
        dir_name = sanitize(dir_name);
    }
    return dir_name;
    //$('#sidebar .toc-video-item[data-video-id="179445"]').parent().siblings('.chapter-row').find('[data-ga-label="toc-chapter"]').text()
}
function sanitize(string) {
    if (string) {
        string = string.replace(/[^a-zA-Z0-9\-. \/]/gi, '');
    };
    return string;
}
function getParameterByName(name, url) {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function lynda_post_video(dir_name, mp4_source) {
    if (dir_name && mp4_source && getParameterByName('tab_generated') == 'true') {
        console.log(dir_name, mp4_source);
        $.ajax({
            url: host_url + 'download',
            method: 'POST',
            data: {
                source: 'lynda',
                dir_name: dir_name,
                mp4_source: mp4_source
            },
            success: function() {
                window.close();
            }
        });
    }
}
function lynda_open_links() {
    $('#toc-content .video-row a').each(function(a, b) {
        var url = $(b).attr('href');
        send_message_to_background({greeting: 'create_new_tab', url: url});
    });
}
function treehouse_open_links_1() {
    $('.featurette ul a').each(function(a, b) {
        var class_names = $(b).find('> svg').attr('class');
        if (class_names && (class_names.indexOf('video-22-icon') > -1 || class_names.indexOf('complete-outline-icon') > -1)) {
            var url = window.location.origin + b.getAttribute('href');
            console.log(url);
            send_message_to_background({greeting: 'create_new_tab', url: url});
        };
    });
}
function treehouse_open_links_2() {
    $('#workshop-videos li a').each(function(a, b) {
        var url = window.location.origin + b.getAttribute('href');
        console.log(url);
        send_message_to_background({greeting: 'create_new_tab', url: url});
    });
}

function treehouse_download_video() {
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
