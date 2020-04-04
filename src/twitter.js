var Twit = require('twit');

var T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  app_only_auth: true,
});

module.exports = {
  getTweet: function (hashtag, cbk) {
    console.log(`[twitter#getTweet] Searching for ${hashtag}`);
    return T.get(
      'search/tweets',
      {
        q: '#' + hashtag,
        lang: 'fr+OR+eu',
        result_type: 'recent',
        count: 1,
      },
      function (err, data, response) {
        if (err) {
          console.error(`[twitter#getTweet] Failed to find a tweet with ${hashtag}`, err);
          return cbk(err);
        }
        if (!data.statuses[0]) return cbk(null, null);

        var tweet_url =
          'https://twitter.com/' + data.statuses[0].user.screen_name + '/status/' + data.statuses[0].id_str;

        return cbk(null, tweet_url);
      }
    );
  },
};
