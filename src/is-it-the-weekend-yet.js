var request = require('request');

const URL = 'http://estcequecestbientotleweekend.fr/api';

function isItTheWeekendYet(callback) {
  request(URL, function (err, response, body) {
    if (!err && response.statusCode == 200) {
      json = JSON.parse(body);

      var r = json.text;
      if (json.subtext) {
        r += ', ' + json.subtext
      }

      callback(null, r.trim());
    } else {
      callback(new Error('Not able to fetch ' + URL));
    }
  })
}

module.exports = isItTheWeekendYet;
