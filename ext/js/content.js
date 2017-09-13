var host_url = 'https://139.59.118.97/grabber/';
console.log('>>', host_url);

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
    var lynda_timer;
    clearInterval(lynda_timer);
    lynda_timer = setInterval(function() {
        $('video').each(function() {
            var mp4_source = $(this).attr('data-src');
            if (mp4_source && mp4_source.indexOf('/secure/courses/') > -1) {
                clearInterval(lynda_timer);
                var dir_name = lynda_dir_name_get(this);
                console.log('>>', dir_name);
                grabber_save_video('lynda', dir_name, mp4_source);
            }
        });
    }, 1000);
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.greeting == "open_links") {
            lynda_open_links();
            sendResponse({status: "Opening Links"});
        }
    });
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
function lynda_dir_name_get(video_element) {
    //$('#sidebar .toc-video-item[data-video-id="179445"]').parent().siblings('.chapter-row').find('[data-ga-label="toc-chapter"]').text()
    var dir_name = false;
    var video_info = false;
    try {
        video_info = JSON.parse($(video_element).attr('data-conviva'));
    } catch (e) {}

    console.log('>>', video_info);
    if (video_info && parseInt(video_info.VideoId) > 0) {
        var video_id = video_info.VideoId;
        var course_title = utl_string_replace_colon_by_dash(video_info.CourseTitle);
        var chapter_title = $('#sidebar .toc-video-item[data-video-id="' + video_id + '"]').parent().siblings('.chapter-row').find('[data-ga-label="toc-chapter"]').text();
        var video_title = ($('#sidebar .toc-video-item[data-video-id="' + video_id + '"]').prevAll().length + 1) + '. ' + video_info.VideoTitle;
        console.log('>>', video_id, course_title, chapter_title, video_title);
        var dir_name = course_title + '/' + chapter_title + '/' + video_title;
        var lynda_learning_path = lynda_learning_path_get();
        if (lynda_learning_path) {
            dir_name = lynda_learning_path + '/' + dir_name;
        }
        dir_name = utl_string_sanitize(dir_name);
    }
    return dir_name;
}
function lynda_learning_path_get() {
    var lynda_learning_path = false;
    var lynda_learning_path_link = $('[data-ga-label="breadcrumb-item"]').first().attr('href');
    var lynda_learning_path_text = $('[data-ga-label="breadcrumb-item"] span').first().text();

    if (typeof lynda_learning_path_link === 'string' && lynda_learning_path_link.indexOf('/learning-paths/') > -1 && typeof lynda_learning_path_text === 'string' && lynda_learning_path_text.indexOf('Learning Path: ') > -1) {
        var lynda_learning_path_category = lynda_learning_path_link.split('/learning-paths/')[1];
        var lynda_learning_path_subcategory = lynda_learning_path_text.split('Learning Path: ')[1];
        if (lynda_learning_path_category && lynda_learning_path_subcategory) {
            lynda_learning_path = 'Learning Path' + '/' + lynda_learning_path_category.split('/')[0] + '/' + lynda_learning_path_subcategory.split('/')[0];
        }
    }
    return lynda_learning_path;
}
function lynda_open_links() {
    $('#toc-content .video-row a').each(function(a, b) {
        var url = $(b).attr('href');
        send_message_to_background({greeting: 'create_new_tab', url: url});
    });
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
function utl_string_sanitize(string) {
    if (string) {
        string = string.replace(/[^a-zA-Z0-9\-. \/]/gi, '');
    };
    return string;
}
function utl_string_replace_colon_by_dash(string) {
    if (string) {
        string = string.replace(/[\:]/gi, '-');
    };
    return string;
}
function utl_url_param_get_by_name(name, url) {
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
function send_message_to_background(message, callback) {
    chrome.runtime.sendMessage(message, function(response_ext) {
        if (typeof callback === 'function') {
            callback(response_ext);
        }
    });
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
function grabber_save_video(source, dir_name, mp4_source) {
    var allowed_sources = ['lynda', 'treehouse'];
    if (allowed_sources.indexOf(source) > -1 && dir_name && mp4_source && utl_url_param_get_by_name('tab_generated') == 'true') {
        console.log('>>', source, dir_name, mp4_source);
        if (dir_name.length > 1 && mp4_source.length > 1) {
            $.ajax({
                url: host_url + 'download',
                method: 'POST',
                data: {
                    source: source,
                    dir_name: dir_name,
                    mp4_source: mp4_source
                },
                success: function() {
                    window.close();
                }
            });
        }
    }
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////
