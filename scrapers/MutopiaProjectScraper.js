const cheerio = require('cheerio');
const BaseScraper = require('./baseScraper');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const { SheetBuilder } = require('../model/sheet');


let browser;
batch = 10;
class MutopiaProjectScraper extends BaseScraper {


    constructor(dbEnabled, dbName) {
        super(dbEnabled, dbName);
        this.url = 'https://www.mutopiaproject.org/cgibin/make-table.cgi?Instrument=Violin'
    }

    async scrape() {
        const total = await this.countTotal();
        for (let startAt=0; startAt<=total; startAt+=10) {
            await this.fetchPage(startAt, this.url)
            .then($ => this.parsePage($))
            .then($ => this.handlePageData($));
        }
        
    }
    

    toString = () => 'CURRENT SCRAPER: MutopiaProjectScraper';

    async countTotal() {
        let total;
        browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        await page.goto(`https://www.mutopiaproject.org/instruments.html`, {waitUntil: 'domcontentloaded'});
        const content = await page.content();
        const $$ = cheerio.load(content);
        $$('.browse-list li').each((index, elt) => {
            const text = $$(elt).text().toLowerCase();
            if (text.includes('violin')) {
                total = extractNumber(text);
            }
        })
        page.close();
        return total;
    }

    async fetchPage(startAt, url) {
        console.log(`scrapping page ${startAt/batch}`);
        const page = await browser.newPage();
        await page.goto(`${url}&startat=${startAt}`, {waitUntil: 'domcontentloaded', headless: false});
        const content = await page.content();
        page.close();
        return content;
    }
    
    parsePage(data) {
        const $ = cheerio.load(data);
        return $;
    }
    
    async handlePageData($) {
        const rows = $('.result-table tbody');
        rows.each(((i, item) => {
            this.parseRow($, item);
        }))
    }

    async parseRow($, row) {
        const subRows = $(row).find('tr');
        const title = $(subRows.get(0)).find('td').eq(0).text();
        const composer = extractComposer($(subRows.get(0)).find('td').eq(1).text()).toLowerCase();
        const parts = extractParts($(subRows.get(1)).find('td').eq(0).text());
        const genre = $(subRows.get(1)).find('td').eq(2).text();
        const url = $(subRows.get(4)).find('td').eq(1).find('a').attr('href')?.trim();
        const downloadLink = url;
        const builder = new SheetBuilder();
        const sheet = builder.setTitle(title)
            .setComposer(composer)
            .setDownloadLink(downloadLink)
            .setGenre(genre)
            .setParts(parts)
            .setUrl(url)
            .build();
        super.saveData(sheet);
    }

}
  
  
    

    function extractComposer(str) {
        return str
            .replace(/^by\s+/i, '') 
            .replace(/\s*\([\d–-]+\)\s*$/, '')
            .trim();
    }

    function extractParts(str) {
        return str
            .replace(/^for\s+/i, '') 
            .trim();
    }

    function extractNumber(str) {
        const match = str.match(/\[(\d+)\]/);
        return match ? match[1] : null;
    }

module.exports = MutopiaProjectScraper;