const scrapers = require('./scrapers/scrapers');

async function run() {
	console.log(scrapers);
	for (const key in scrapers) {
		const ScraperClass = scrapers[key];
		const scraper = new ScraperClass();
		try {
			console.log(scraper.toString());
			await scraper.scrape();

		} catch (e) {
			console.log('error scraping ' + key);
			console.log(e);
		}

	}
	console.log('********* SCRAPING COMPLETE ****************');
}

run();