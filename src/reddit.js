const axios = require('axios');
const path = 'https://www.reddit.com/r'; // holdmyfeedingtube.json?limit=2

exports.getLastSubRedditPost = getLastSubRedditPost;
exports.getRandomSubRedditPost = getRandomSubRedditPost;
exports.getSubRedditName = getSubRedditName;

async function getLastSubRedditPost(name) {
  try {
    const result = await axios.get(`${path}/${name}.json?limit=1`);
    const post = result.data.data.children.find((data) => !data.data.stickied);
    return post.data.url;
  } catch (err) {
    console.error('[reddit#getLastSubRedditPost]', err.response.data);
    return 'Sub inconnu/privé/whatever mais je trouve ap 🤷🏻‍♂️';
  }
}

async function getRandomSubRedditPost(name) {
  try {
    const result = await axios.get(`${path}/${name}/random.json`);
    return result.data[0].data.children[0].data.url;
  } catch (err) {
    console.error('[reddit#getRandomSubRedditPost]', err.response.data);
    return 'Sub inconnu/privé/whatever mais je trouve ap 🤷🏻‍♂️';
  }
}

async function getSubRedditName() {
  try {
    const result = await axios.get(`https://www.reddit.com/reddits.json?limit=100`);
    const subs = result.data.data.children.map((sub) => sub.data.display_name);
    return subs.join(', ');
  } catch (err) {
    console.error('[reddit#getSubRedditName]', err.response.data);
    return "C'est mort.";
  }
}
