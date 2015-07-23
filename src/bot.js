var fs = require('fs');
var TelegramBot = require('node-telegram-bot-api');

var config = JSON.parse(fs.readFileSync(__dirname + '/../config.json'));

var bot = new TelegramBot(config.token, {polling: true});
bot.on('message', function (msg) {
  var chatId = msg.chat.id;
  var text = msg.text;

  if (/^\/tricount/.test(text))
    bot.sendMessage(chatId, config.tricount.url);
});
