//var deletes = [];
var bdgclr = [0, 255, 0, 160];
chrome.browserAction.onClicked.addListener(function(tab) {
    var x = document.createElement("a");
    x.href = tab.url;
    chrome.history.search({text: x.hostname, startTime: 0, endTime: (new Date()).getTime(), maxResults: 10000}, function(histItems) {
        for(i = 0; i < histItems.length; i++)
        {
            chrome.history.deleteUrl({url: (histItems[i]).url}, null);
        }
    });

    chrome.browserAction.setBadgeText({text: 'clean', tabId: tab.id});
    chrome.browserAction.setBadgeBackgroundColor({color: bdgclr, tabId: tab.id});
});

setInterval(save, 60000); //one minute interval for saving/pushing the history

function save() {
    //get the last start time and then update the last start time
    var lastStart = 0;
    chrome.storage.local.get('lastStartUp', function(result){
        if(result)
        {
            lastStart = result;
        }
    })
    chrome.storage.local.set({'lastStartUp': (new Date()).getTime()});

    //populate logDatas with history data for history items that are new since the last start time
    var logDatas = [];
    chrome.history.search({text: '', startTime = lastStart, endTime = (new Date()).getTime(), maxResults: 10000}, function(histItems){
        for(i = 0; i < histItems.length; i++)
        {
            var h = histItems[i];
            logDatas.push({date: h.lastVisitTime, url: h.url, loggedInputs: {visitCount: h.visitCount, typedCount: h.typedCount} });
        }
    });
    var logMessJSON = JSON.stringify({logs: logDatas});

    //now push the JSON to the other extension. 
}

