// Message Passing section
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.greeting == 'create_new_tab') {
        if (request.url) {
            var url = request.url;
            setTimeout(function() {
                chrome.tabs.create({
                    url: url
                }, function() {});
            }, Math.floor(Math.random() * 15) + 1 );
        }
    }
});
