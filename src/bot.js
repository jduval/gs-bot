var TelegramBot = require('node-telegram-bot-api');

var bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});
bot.on('message', function (msg) {
  var chatId = msg.chat.id;
  var text = msg.text;

  if (/^\/tricount/.test(text))
    bot.sendMessage(chatId, process.env.TRICOUNT_URL);
});
