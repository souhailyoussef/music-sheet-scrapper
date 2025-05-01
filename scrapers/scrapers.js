const scraper1 = require('./ArabicMusicalScoreScraper');
const scraper2 = require('./DokanBachScraper');
const scraper3 = require('./MutopiaProjectScraper');
const scraper4 = require('./SalahMahdiScraper');
const scrapers = {
	scraper1: scraper1,
  scraper2: scraper2,
  scraper3: scraper3,
  scraper4: scraper4
  };

  module.exports = scrapers;