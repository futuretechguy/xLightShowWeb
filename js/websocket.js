
var ws = new ReconnectingWebSocket("ws://" + location.hostname + ":" + "81" + "/"); 

ws.onopen = function (evt) {
    SetConnectionStatus("Connected!")
};

ws.onmessage = function (evt) {
    ProcessMessage(evt.data, ws)
};

ws.onclose = function (evt) {
    alert("Connection closed");
    SetConnectionStatus("Connection closed!")             
};

ws.onerror = function (error) {
    console.log('WebSocket Error ' + error);
    SetConnectionStatus("Status: an error occured!") 
};



