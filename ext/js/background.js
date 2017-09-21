// Message Passing section
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.greeting == 'create_new_tab') {
        if (request.url) {
            var url = utl_url_query_param_add(request.url, 'tab_generated', 'true');
            if (url) {
                setTimeout(function() {
                    chrome.tabs.create({
                        url: url
                    }, function() {});
                }, Math.floor(Math.random() * 15 * 1000) + 1);
            }
        }
    }
});
function utl_url_query_param_add(url, key, value) {
    if (url) {
        if (url.indexOf('?') > -1) {
            url = url + '&' + key + '=' + value;
        } else {
            url = url + '?' + key + '=' + value;
        }
    }
    return url;
}

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.sendMessage(tab.id, {
        greeting: "open_links"
    }, function(response) {
        console.log(response);
    });
});
