
const builder = require('./scrape');

let wiki = 'eo'; // Esperanto
let size = 10; // MB
let directory = './esperanto'; // output for articles

// starts on the main page and crawls links (most significant articles first)
builder.crawl(wiki, size, directory, (err) => {
  if (err) {
    throw err;
  }
  console.log('downloaded ' + size + 'MB from ' + wiki + '.wikipedia.org');
});
