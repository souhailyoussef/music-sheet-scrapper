const axios = require('axios');
const cheerio = require('cheerio');
const { SheetBuilder } = require('../model/sheet');
const BaseScraper = require('./baseScraper');



class ArabicMusicalScoreScraper extends BaseScraper {

	constructor(dbEnabled, dbName) {
        super(dbEnabled, dbName);
		this.url = `https://www.arabicmusicalscores.com/free-sheetmusic/`;
    }

	async scrape() {
		const { data } = await axios.get(this.url);
		const $ = cheerio.load(data);
		await this.parseTable($);
	}

	toString = () => 'CURRENT SCRAPER: ArabicMusicalScoreScraper';

	async parseTable($) {
		const rows = $('.sheet-music-table tbody tr');
		for (const row of rows) {
			await this.processTableRow($, row);
		}
	}
	
	async processTableRow($, row) {
		const $row = $(row);
		const builder = new SheetBuilder();
		const headers = $row.find('th');
		const aElements = $(headers.get(0)).find('a');
		if (aElements.length >= 2) {
			const title = $(aElements[0]).text().trim();
			builder.setTitle(title);
			builder.setUrl($(aElements[0]).attr('href').trim());
			const link = await this.scrapeDownloadPage($(aElements[0]).attr('href').trim());
			builder.setDownloadLink(link);
			builder.setComposer($(aElements[1]).text().trim());
		}
		const cells = $row.find('td');
		builder.setGenre($(cells.get(0)).text().trim());
		builder.setParts($(cells.get(1)).text().trim());
		builder.setDifficulty($(cells.get(2)).text().trim());
		const sheet = builder.build();
		super.saveData(sheet);
	}
	
	async scrapeDownloadPage(link) {
		const { data } = await axios.get(link);
		const $$ = cheerio.load(data);
		const url = ($$('.download-box a.button')).attr('href');
		return url;
	}
}

module.exports = ArabicMusicalScoreScraper;