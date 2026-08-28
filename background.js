// activate the toolbar action only when url contains 'connect.garmin.com'
chrome.runtime.onInstalled.addListener(function() {
    chrome.action.disable();
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { urlContains: 'connect.garmin.com' },
                    })
                ],
                actions: [ new chrome.declarativeContent.ShowAction() ]
            }
        ]);
    });
});

const winspecs = { type: 'popup', width: 1300, height: 820, top: 100, left: 100 };
// const gpxviewerUrl = 'http://localhost:3016/gpx/activity_@id.gpx'; // nb dit geeft download vd gpx file!
const gpxviewerUrl = 'http://viewer2/gpx/activity_@id.gpx';

//http://viewer2/gpx/activity_4676092659.gpx

function getIdFromGarminConnect(url) {
    const words = url.split('/');
    return words[words.length - 1];
}

function callUrl(activeurl) {
    const id = getIdFromGarminConnect(activeurl);
    const url = gpxviewerUrl.replace('@id', id);
    chrome.windows.create({ url, ...winspecs });
}

// execute action when user clicks the toolbar icon
chrome.action.onClicked.addListener(tab => {
    callUrl(tab.url);
});
