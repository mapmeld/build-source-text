
const builder = require('./scrape');

let wiki = 'my'; // Esperanto
let size = 7; // MB
let directory = './burmese'; // output for articles

// starts on the main page and crawls links (most significant articles first)
builder.crawl(wiki, size, directory, (err) => {
  if (err) {
    throw err;
  }
  console.log('downloaded ' + size + 'MB from ' + wiki + '.wikipedia.org');
});
