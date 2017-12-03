# build-source-text

Node module to pull down *n* MB of plaintext from a language's Wikipedia for NLP/analysis.

Avoids duplicate articles, meta/category articles, additional links and templating, HTML, etc.

## Usage

```javascript
const builder = require('build-source-text');

let wiki = 'eo'; // Esperanto
let size = 10; // MB
let directory = './esperanto'; // existing directory output for articles

// starts on the main page and crawls links (most significant articles first)
builder.crawl(wiki, size, directory, (err) => {
  if (err) {
    throw err;
  }
  console.log('downloaded ' + size + 'MB from ' + wiki + '.wikipedia.org');
});

// uses random article
builder.random(wiki, size, directory, callback);
```

## License

Open source, MIT license
