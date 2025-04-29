const axios = require('axios');
const cheerio = require('cheerio');
const { SheetBuilder } = require('../model/sheet');
const {appendToFile} = require('../util/fileWriter');
const BaseScraper = require('./baseScraper');
const {downloadFile} = require('./../util/fileDownloader');


let $;
const url = `https://www.arabicmusicalscores.com/free-sheetmusic/`;

class ArabicMusicalScoreScraper extends BaseScraper {

	async scrape() {
		const { data } = await axios.get(url);
		$ = cheerio.load(data);
		parseTable().catch(err => console.log(err));
	}

	toString = () => 'CURRENT SCRAPER: ArabicMusicalScoreScraper';
}


async function parseTable() {
	const rows = $('.sheet-music-table tbody tr');
	rows.each((index, row) => {
		processTableRow(row);
	})
}

async function processTableRow(row) {
	const $row = $(row);
	const builder = new SheetBuilder();
	const headers = $row.find('th');
	const aElements = $(headers.get(0)).find('a');
	if (aElements.length >= 2) {
		const title = $(aElements[0]).text().trim();
		builder.setTitle(title);
		builder.setUrl($(aElements[0]).attr('href').trim());
		const link = await scrapeDownloadPage($(aElements[0]).attr('href').trim());
		builder.setDownloadLink(link);
		builder.setComposer($(aElements[1]).text().trim());
	}
	const cells = $row.find('td');
	builder.setGenre($(cells.get(0)).text().trim());
	builder.setParts($(cells.get(1)).text().trim());
	builder.setDifficulty($(cells.get(2)).text().trim());
	const sheet = builder.build();
	appendToFile(sheet);
}

async function scrapeDownloadPage(link) {
	const { data } = await axios.get(link);
    const $$ = cheerio.load(data);
	const url = ($$('.download-box a.button')).attr('href');
	return url;
	//downloadFile(url, filename);

}


module.exports = ArabicMusicalScoreScraper;