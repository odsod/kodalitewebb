var express = require('express');
var bodyParser = require('body-parser');

var api = express();
api.use(bodyParser.json());

var chatMessages = ['hej från servern!'];

api.get('/api/chat-messages', function(req, res) {
  res.send(chatMessages);
});

api.post('/api/chat-messages', function(req, res) {
  var chatMessage = req.body.text;
  chatMessages.push(chatMessage);
  res.send(chatMessages);
});

api.listen(8080);
