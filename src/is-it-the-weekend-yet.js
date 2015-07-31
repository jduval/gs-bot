var cheerio = require('cheerio');
var request = require('request');

const URL = 'http://estcequecestbientotleweekend.fr';
const SELECTOR = '.msg';

function isItTheWeekendYet(callback) {
  request(URL, function (err, response, body) {
    if (!err && response.statusCode == 200) {
      var d = cheerio.load(body);

      callback(null, d(SELECTOR).text().trim());
    } else {
      callback(new Error('Not able to fetch ' + URL));
    }
  })
}

module.exports = isItTheWeekendYet;
