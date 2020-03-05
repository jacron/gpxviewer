// activate page action when url contains 'connect.garmin.com'
chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { urlContains: 'connect.garmin.com' },
                    })
                ],
                actions: [ new chrome.declarativeContent.ShowPageAction() ]
            }
        ]);
    });
});

const winspecs = 'width=1300,height=820,resizable=0,locationbar=0,top=100,left=100';
const gpxviewerUrl = 'http://localhost:4200/gpx/activity_@id.gpx/blue';

function getIdFromGarminConnect(url) {
    const words = url.split('/');
    return words[words.length - 1];
}

function callUrl(activeurl) {
    const id = getIdFromGarminConnect(activeurl);
    const url = gpxviewerUrl.replace('@id', id);
    window.open(
        url,
        'gpxviewer',
        winspecs
    );
}

// execute pageaction when user clicks icon
chrome.pageAction.onClicked.addListener(tab => {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        callUrl(tabs[0].url);
    });
});
