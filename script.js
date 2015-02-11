var inputElement = document.querySelector('input');
var chatLogElement = document.querySelector('pre');

var ajax = function(method, url, callback, data) {
  var request = new XMLHttpRequest();
  request.open(method, url, true);
  request.setRequestHeader('Content-Type', 'application/json');
  if (callback) {
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        callback(JSON.parse(request.responseText));
      }
    };
  }
  request.send(JSON.stringify(data));
};

var sendChatMessage = function(chatMessage) {
  ajax('POST', '/api/chat-messages', displayChatMessages, {text: chatMessage});
};

var displayChatMessages = function(chatMessages) {
  chatLogElement.textContent = chatMessages.reverse().join('\n');
};

inputElement.addEventListener('keyup', function(e) {
  if (e.keyCode === 13) { // enter key was pressed
    var chatMessage = inputElement.value;
    sendChatMessage(chatMessage);
    inputElement.value = '';
  }
});

var getChatMessages = function() {
  ajax('GET', '/api/chat-messages', displayChatMessages);
};

getChatMessages();
setInterval(getChatMessages, 1000);
