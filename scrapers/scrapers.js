const scraper1 = require('./ArabicMusicalScoreScraper');
const scraper2 = require('./DokanBachScraper');
const scraper3 = require('./MutopiaProjectScraper');
const scraper4 = require('./SalahMahdiScraper');
const scrapers = {
	1: scraper1,
  2: scraper2,
  3: scraper3,
  4: scraper4
  };

  module.exports = scrapers;