function sendMessage(historyJSON) {
  //"historyJSON" a correctly formatted JSON object that can be sent directly to server

  var xhttp = new XMLHttpRequest();
  //The URL used in open() needs to be updated to the current IP Address:Port Number before each test, as the server inherits the potentially variable IP address from its host machine
  xhttp.open('POST', "http://128.237.202.32:4567/LicenseRegistry", true);
  xhttp.send(JSON.stringify(historyJSON));
}

window.onload = function(){
  readLogs();
  setInterval(readLogs, 60000); // One minute interval for reading from clipboard
}

function readLogs() {
  var allgood = 1;
  var txtbox;
//  window.onload = function(){
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

      message = JSON.parse(text);
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
            else{
              //alert("Failure - at least one message.logs member was invalid");
            }
          }
        }
        else{
          //alert("message.logs is null")
        }
      }
      else{
        //alert("message could not be parsed to JSON");
      }
    }
    else{
      //alert("couldn't read from clipboard");
    }
//  }
}
