const TelegramBot = require('node-telegram-bot-api');
const twitter = require('./twitter');
const isItTheWeekendYet = require('./is-it-the-weekend-yet');
const reddit = require('./reddit');
const CronJob = require('cron').CronJob;

const REPLIES = ['ahah', 'lol', '^^', 'Drôle !', "Ça c'est rigolo", 'Hi hi'];

const TURNUP = ['ouloulou', 'turn up', 'turnup', 'turnoup'];

const ERROR_EMOJI = ['😱', '😨', '😰', '😭'];
const SHOCK_EMOJI = ['😨', '😰', '😱', '😮'];

function getRandomEmoji(emojiList) {
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

const JEANJASS_ID = process.env.JEANJASS_ID;
const GROUP_CHAT_ID = process.env.GROUP_CHAT_ID;

bot.sendMessage(JEANJASS_ID, `Je viens de reboot 🤖 à ${new Date().toISOString()}`);

var job = new CronJob(
  '0 16 * * *', // eveyday at 4pm
  async function () {
    const message = `Your daily dose of ${getRandomEmoji(SHOCK_EMOJI)} !! ${await reddit.getRandomSubRedditPost(
      'holdmyfeedingtube'
    )}`;
    bot.sendMessage(GROUP_CHAT_ID, message);
  },
  null,
  true,
  'Europe/Paris'
);
job.start();

bot.on('message', async function (msg) {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (/^\/tricount/.test(text)) {
    bot.sendMessage(chatId, process.env.TRICOUNT_URL);
  }

  if (/^#/.test(text)) {
    const matches = text.match(/#([^#]+)[\s,;]*/g);
    if (matches) {
      const hashtag = matches[1] ? matches[1] : matches[0];
      return twitter.getTweet(hashtag, function (err, tweet_url) {
        if (err) return false;

        if (tweet_url) return bot.sendMessage(chatId, tweet_url);
        return bot.sendMessage(chatId, `Tweetasse not found ${getRandomEmoji(ERROR_EMOJI)}`);
      });
    }
  }

  if (/^\/weekend/.test(text)) {
    isItTheWeekendYet(function (err, m) {
      bot.sendMessage(chatId, m);
    });
  }

  TURNUP.map((entry) => {
    const regExp = new RegExp(entry, 'i');
    if (regExp.test(text))
      bot
        .forwardMessage(chatId, 91220779, 67113) // TURN UP !!!
        .catch(console.error);
  });

  /**
   * Reddit
   */

  const matchesLast = text.match(/last reddit ?(.*)/i);
  if (matchesLast && !matchesLast[1]) {
    bot.sendMessage(chatId, 'De quel sub ?');
  } else if (matchesLast && matchesLast[1]) {
    bot.sendMessage(chatId, await reddit.getLastSubRedditPost(matchesLast[1]));
  }

  const matchesRandom = text.match(/random reddit ?(.*)/i);
  if (matchesRandom && !matchesRandom[1]) {
    bot.sendMessage(chatId, 'De quel sub ?');
  } else if (matchesRandom && matchesRandom[1]) {
    bot.sendMessage(chatId, 'Je cherche... 👀');
    bot.sendMessage(chatId, await reddit.getRandomSubRedditPost(matchesRandom[1]));
  }

  if (/^\/sublist/.test(text)) {
    bot.sendMessage(chatId, await reddit.getSubRedditName());
  }
});
