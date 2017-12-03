const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

function crawl(wiki, size, directory, callback) {
  let charLimit = size * 1024 * 1024;
  if (isNaN(charLimit)) {
    return callback('size is not a valid Number');
  }

  let readArticles = [];

  function findLinks(body) {
    let $ = cheerio.load(body);
    let links = $('#mw-content-text .mw-parser-output a');
    let urls = [];
    for (var i = 0; i < links.length; i++) {
      let url = $(links[i]).attr('href');
      // avoid special pages, internal links, outside links, etc
      if (url &&
        (url.indexOf('#') === -1) &&
        (url.indexOf('/w/index.php') === -1) &&
        (url.indexOf(':') === -1) &&
        (urls.indexOf(url) === -1) &&
        (readArticles.indexOf(url) === -1)) {
        urls.push(url);
      }
    }
    return urls;
  }

  function crawlArticles(articles) {
    function crawlArticle(a) {
      if (a >= articles.length) {
        return callback();
      }
      let links = findLinks(articles[a]);
      if (!links.length) {
        // no links within
        return crawlArticle(a + 1);
      }
      scrapeArticles(links, 0);
    }
    crawlArticle(0);
  }

  function scrapeArticles(articles, i) {
    if (i >= articles.length) {
      // reached end of article array, now crawl articles for more links
      return crawlArticles(articles);
    }

    request('https://' + wiki + '.wikipedia.org' + articles[i], (err, resp, body) => {
      if (err) {
        return callback(err);
      }

      // make sure redirect didn't give us a repeat article
      let finalUrl = resp.request.uri.path;
      if (readArticles.indexOf(finalUrl) > -1) {
        setTimeout(() => {
          scrapeArticles(articles, i + 1);
        }, 250);
        return;
      }

      let $ = cheerio.load(body);
      // get rid of citation links
      $('sup').remove();

      // extract text from each paragraph to leave whitespace in between
      let articleText = '';
      $('#mw-content-text .mw-parser-output p').map((index, paragraph) => {
        articleText += $(paragraph).text() + "\n\n";
      });

      // grab article title (as entered)
      let articleTitle = articles[i].split('/');
      articleTitle = articleTitle[articleTitle.length - 1];
      fs.writeFileSync(directory + '/' + articleTitle + '.txt', articleText);

      articles[i] = $('body').html();
      charLimit -= articleText.length;

      if (charLimit > 0) {
        setTimeout(() => {
          scrapeArticles(articles, i + 1);
        }, 250);
      }
    });
  }

  // start on the Main Page
  request('https://' + wiki + '.wikipedia.org/', (err, resp, body) => {
    if (err) {
      return callback(err);
    }

    let articles = findLinks(body);
    if (!articles.length) {
      return callback('main page did not have any useful links');
    }
    scrapeArticles(articles, 0);
  });
}

function random(wiki, size, directory, callback) {

}

module.exports = {
  crawl: crawl,
  random: random
};
