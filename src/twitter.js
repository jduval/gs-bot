var Twit = require('twit');

var T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  app_only_auth: true
});


module.exports = {

  getTweet: function(hashtag, cbk) {

    return T.get(
      'search/tweets',
      {
        q: '#' + hashtag,
        lang: 'fr+OR+eu',
        result_type: 'recent',
        count: 1
      },
      function(err, data, response) {
        if (err) return cbk(err);
        if (!data.statuses[0]) return cbk(null, null);

        var tweet_url = 'https://twitter.com/' +
                        data.statuses[0].user.screen_name +
                        '/status/' +
                        data.statuses[0].id_str;

        return cbk(null, tweet_url);
      }
    );

  }

};
