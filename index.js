const scrapers = require('./scrapers/scrapers');
const { connectToDatabase } = require('./util/db'); 
const yargs = require('yargs');
const {downloadAll} = require('./util/fileDownloader');

async function run() {
	const argv = yargs
		.option('json', {
			alias: 'json',
			description: 'Save output as JSON instead of a MongoDB collection',
			type: 'boolean',
			default: false,
		})
		.option('dbName', {
			alias: 'db',
			description: 'The database name (if saving to MongoDB)',
			type: 'string',
			default: 'sheets',
		})
		.option('download', {
			alias: 'download',
			description: 'Auto download scrapped sheets',
			type: 'boolean',
			default: false
		})
		.option('include', {
			alias: 'i',
			description: 'Scrappers to include (from 1 to 4)',
			type: 'array',
			default: [1,2,3,4]
		})
		.argv;
	const dbEnabled = !argv.json;
	const dbName = argv.dbName;
	const downloadEnabled = argv.download;
	const includedScrapers = argv.include;
	if (dbEnabled) await connectToDatabase(dbName);	
	else console.log('skipping database connection');
	for (const scraper of Object.keys(scrapers)) {
		if (includedScrapers.includes(Number(scraper))) {
			console.log(`scraper ${scraper} included ✅`);
		} else {
			console.log(`scraper ${scraper} excluded ❌`);
		}
	}
	for (const key of includedScrapers) {
		const ScraperClass = scrapers[key];
		const scraper = new ScraperClass(dbEnabled, argv.dbName);
		try {
			console.log(scraper.toString());
			await scraper.scrape();

		} catch (e) {
			console.log('error scraping ' + key);
			console.log(e);
		}

	}
	console.log('**************** SCRAPING COMPLETE ****************');
	if (downloadEnabled) {
		await downloadAll(dbEnabled);
	}
	process.exit('**************** TASKS COMPLETED, CLEANING UP ****************');

	
}

run();