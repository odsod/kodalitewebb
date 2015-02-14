var inputElement = document.querySelector('input');
var chatElement = document.querySelector('pre');

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

var displayChatMessages = function(chatMessages) {
  chatElement.textContent = chatMessages.reverse().join('\n');
};

var sendChatMessage = function(chatMessage) {
  ajax('POST', '/api/chat-messages', displayChatMessages, {text: chatMessage});
};

inputElement.addEventListener('keyup', function(e) {
  if (e.keyCode === 13) { // enter key
    var chatMessage = inputElement.value;
    inputElement.value = '';
    sendChatMessage(chatMessage);
  }
});

var getChatMessages = function() {
  ajax('GET', '/api/chat-messages', displayChatMessages);
};

getChatMessages();
setInterval(getChatMessages, 1000);
