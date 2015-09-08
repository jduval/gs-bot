var TelegramBot = require('node-telegram-bot-api');
var twitter = require('./twitter');
var isItTheWeekendYet = require('./is-it-the-weekend-yet');

var bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});
bot.on('message', function (msg) {
  var chatId = msg.chat.id;
  var text = msg.text;

  if (/^\/tricount/.test(text))
    bot.sendMessage(chatId, process.env.TRICOUNT_URL);

  if (/^\^\^$/.test(text))
    bot.sendMessage(chatId, 'ChapoChapo');

  if (/#/.test(text)) {
    var matches = text.match(/#([^#]+)[\s,;]*/g);
    if (matches) {
      var hashtag = (matches[1]) ? matches[1] : matches[0];
      return twitter.getTweet(hashtag, function(err, tweet_url) {
        if (err)
          return false;

        if (tweet_url)
          return bot.sendMessage(chatId, tweet_url);
        return bot.sendMessage(chatId, 'Tweetasse not found :(');
      });
    }
  }

  if (/^\/weekend/.test(text)) {
    isItTheWeekendYet(function(err, m) {
      bot.sendMessage(chatId, m);
    });
  }
});
