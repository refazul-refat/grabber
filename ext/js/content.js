var database_endpoint = 'https://localhost/grabber/';
var host_url = 'https://139.59.118.97/grabber/';
console.log('>', host_url);

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
                var course_meta_info = lynda_course_meta_info_get(this);
                var dir_name = lynda_dir_name_get(course_meta_info);

                console.log('>>>>', dir_name, mp4_source, course_meta_info);
                if (dir_name) {
                    grabber_save_video('lynda', dir_name, mp4_source, course_meta_info);
                }
            }
        });
    }, 1000);
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.greeting == "open_links") {
            $('video').each(function() {
                var mp4_source = $(this).attr('data-src');
                if (mp4_source && mp4_source.indexOf('/secure/courses/') > -1) {
                    var course_meta_info = lynda_course_meta_info_get(this);
                    var dir_name = lynda_dir_name_get(course_meta_info);
                    if (dir_name.length > 1 && mp4_source.length > 1) {
                        $.ajax({
                            url: database_endpoint + 'courses',
                            method: 'POST',
                            data: course_meta_info,
                            success: function(response) {
                                var course = false;
                                if (typeof response !== 'object') {
                                    try {
                                        response = JSON.parse(response);
                                    } catch(e) {
                                        response = {};
                                    }
                                }
                                course = response.course;
                                if (course) {
                                    if ((course.downloaded > 0)) {
                                        $.ajax({
                                            url: database_endpoint + 'courses/download',
                                            method: 'POST',
                                            data: {
                                                course_id: course.course_id
                                            }
                                        });
                                        lynda_open_links();
                                        sendResponse({status: "Opening Links"});
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    });
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
function lynda_course_meta_info_get(video_element) {
    var course_meta_info = {};
    var video_info = false;
    try {
        video_info = JSON.parse($(video_element).attr('data-conviva'));
    } catch (e) {}

    if (video_info && parseInt(video_info.CourseId) > 0) {
        course_meta_info.course_id = video_info.CourseId;
        course_meta_info.course_title = video_info.CourseTitle;
        course_meta_info.category = lynda_course_category_get();
        course_meta_info.subcategory = lynda_course_subcategory_get();

        course_meta_info.release_year = video_info.ReleaseYear;
        course_meta_info.release_month = lynda_course_release_month_get();
        course_meta_info.release_date = lynda_course_release_date_get();

        course_meta_info.duration = lynda_course_duration_get();
        course_meta_info.author = video_info.Author;
        course_meta_info.level = video_info.SkillLevel;
        course_meta_info.views = lynda_course_views_get();

        course_meta_info.video_id = video_info.VideoId;
        course_meta_info.video_title = video_info.VideoTitle;
        course_meta_info.video_info = video_info;
    }
    return course_meta_info;
}
function lynda_course_category_get() {
    var lynda_course_category = $($('.breadcrumb li a')[0]).text().trim();
    if (typeof lynda_course_category === 'string' && lynda_course_category.length > 1) {
        return lynda_course_category;
    }
    return false;
}
function lynda_course_subcategory_get() {
    var lynda_course_subcategory = $($('.breadcrumb li a')[1]).text().trim();
    if (typeof lynda_course_subcategory === 'string' && lynda_course_subcategory.length > 1) {
        return lynda_course_subcategory;
    }
    return false;
}
function lynda_course_release_month_get() {
    var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    var t = $('#release-date').text().trim();
    var month = false;
    if (t.split('/').length == 3 && parseInt(t.split('/')[0]) >= 1 && parseInt(t.split('/')[0]) <= 12) {
        month = months[parseInt(t.split('/')[0]) - 1];
    }
    return month;
}
function lynda_course_release_date_get() {
    var t = $('#release-date').text().trim();
    if (t.split('/').length == 3) {
        return t.split('/')[2] + '-' + t.split('/')[0] + '-' + t.split('/')[1];
    }
    return false;
}
function lynda_course_duration_get() {
    var t = $('#course-info .course-info-stat-cont.duration span').text().trim();
    var h = 0;
    var m = 0;
    var s = 0;
    if (t.indexOf('h') > -1) {
        h = parseInt(t.split('h')[0]);
        t = t.split('h')[1];
    }
    if (t.indexOf('m') > -1) {
        m = parseInt(t.split('m')[0]);
        t = t.split('m')[1];
    }
    if (t.indexOf('s') > -1) {
        s = parseInt(t.split('s')[0]);
        t = t.split('s')[1];
    }
    s = s + m * 60 + h * 3600;
    return s;
}
function lynda_course_views_get() {
    var t = $('#course-viewers').text().trim();
    t = t.replace(/[, ]/g, '');
    return t;
}
function lynda_dir_name_get(course_meta_info) {
    var dir_name = false;
    course_meta_info = course_meta_info || {};

    if (parseInt(course_meta_info.course_id) > 0 && parseInt(course_meta_info.video_id) > 0) {
        var video_id = course_meta_info.video_id;
        var course_title = utl_string_sanitize(utl_string_replace_colon_by_dash(course_meta_info.course_title));
        var chapter_title = utl_string_sanitize($('#sidebar .toc-video-item[data-video-id="' + video_id + '"]').parent().siblings('.chapter-row').find('[data-ga-label="toc-chapter"]').text());
        var video_title = utl_string_sanitize(($('#sidebar .toc-video-item[data-video-id="' + video_id + '"]').prevAll().length + 1) + '. ' + course_meta_info.video_title);
        var dir_name = course_title + '/' + chapter_title + '/' + video_title;

        console.log('>>', dir_name);
        var lynda_learning_path = lynda_learning_path_get();
        if (lynda_learning_path) {
            dir_name = lynda_learning_path + '/' + dir_name;
        } else {
            var lynda_category_path = lynda_category_path_get(course_meta_info);
            if (lynda_category_path) {
                dir_name = lynda_category_path + '/' + dir_name;
            }
        }
    }
    console.log('>>>', dir_name);
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
            lynda_learning_path = 'Learning Path' +
                '/' + utl_string_sanitize(lynda_learning_path_category.split('/')[0]) + '/' + utl_string_sanitize(lynda_learning_path_subcategory.split('/')[0]);
        }
    }
    return lynda_learning_path;
}
function lynda_category_path_get(course_meta_info) {
    course_meta_info = course_meta_info || {};
    if (typeof course_meta_info.category === 'string' && typeof course_meta_info.subcategory === 'string') {
        return course_meta_info.category + '/' + course_meta_info.subcategory;
    }
    return false;
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
        string = string.replace(/[^a-zA-Z0-9\-. ]/gi, '');
        string = string.replace(/^[.\s]+|[.\s]+$/gm, '');
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
function grabber_save_video(source, dir_name, mp4_source, course_meta_info) {
    var allowed_sources = ['lynda', 'treehouse'];
    if (allowed_sources.indexOf(source) > -1 && typeof dir_name === 'string' && typeof mp4_source === 'string' && utl_url_param_get_by_name('tab_generated') == 'true') {
        if (dir_name.length > 1 && mp4_source.length > 1) {
            console.leng('**', source,dir_name,mp4_source);
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
            send_message_to_background({greeting: 'create_new_tab', url: url});
        };
    });
}
function treehouse_open_links_2() {
    $('#workshop-videos li a').each(function(a, b) {
        var url = window.location.origin + b.getAttribute('href');
        send_message_to_background({greeting: 'create_new_tab', url: url});
    });
}
function treehouse_download_video() {
    var dir_name = location.href.split('/library/')[1];
    var mp4_source = $('video source[type="video/mp4"]').attr('src');
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
