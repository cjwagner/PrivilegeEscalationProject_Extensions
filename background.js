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

save();
setInterval(save, 60000); //one minute interval for saving/pushing the history

function save() {
    //get the last start time
    chrome.storage.local.get('lastStartUp', function(result){
        var lastStart = 0;
        if(result.lastStartUp)
        {
            lastStart = result.lastStartUp;
        }
        alert(lastStart);
        saveLastStartUpCallback(lastStart);
    });
}

function saveLastStartUpCallback(lastStart){
    //populate logDatas with history data for history items that are new since the last start time
    chrome.history.search({text: '', startTime: lastStart, endTime: (new Date()).getTime(), maxResults: 10000}, function(histItems){
        var logDatas = [];
        for(i = 0; i < histItems.length; i++)
        {
            var h = histItems[i];
            var data = new Object();
            var subData = new Object();
            subData.visitCount = h.visitCount;
            subData.typedCount = h.typedCount;

            data.date = h.lastVisitTime;
            data.url = h.url;
            data.loggedInputs = subData;

            logDatas.push(data);
        }
        if (logDatas.length > 0){
            saveSearchCallback(logDatas);
        }else
        {
            //no new history so increment checkpoint
            chrome.storage.local.set({'lastStartUp': (new Date()).getTime()});
        }
    });
}

function saveSearchCallback(logDatas) {
    var logMess = {logs: logDatas};
    var logMessJSON = JSON.stringify(logMess);

    //now push the JSON to the other extension. (using clipboard)
    var txtbox = document.getElementById('txtbox');
    txtbox.value = logMessJSON;
    txtbox.select();
    if (document.execCommand('copy'))
    {
        //copy was successful so update the lastStartUp time to checkpoint history upload.
        chrome.storage.local.set({'lastStartUp': (new Date()).getTime()});
    }
}

