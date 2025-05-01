const cheerio = require('cheerio');
const BaseScraper = require('./baseScraper');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const { SheetBuilder } = require('../model/sheet');
const axios = require('axios');


batch = 10;
var browser;
class SalahMahdiScraper extends BaseScraper {

    constructor(dbEnabled, dbName) {
        super(dbEnabled, dbName);
        this.url = 'https://www.salahelmahdi.com/musique';
    }

    async scrape() {
        const totalPages = await this.countTotal(this.url);
        console.log(`${totalPages} pages to scrape...`);
        for (let currPage=1; currPage<=totalPages; currPage++) {
            await this.fetchPage(currPage, this.url)
            .then($ => this.parsePage($))
            .then(data => this.handlePageData(data));
        }
        
    }

    toString = () => 'CURRENT SCRAPER: SalahMahdiScraper';

    async countTotal(url) {
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`${url}`, {waitUntil: 'domcontentloaded'});
        const content = await page.content();
        const $$$ = cheerio.load(content);
        const total = $$$('ul.pagination li').eq(-2).find('a').text().trim();
        page.close();
        return total;
    }
    
     async fetchPage(index, url) {
            console.log(`scrapping page ${index}`);
            const {data} = await axios.get(`${url}?page=${index}`);
            return data;
        }
        
        parsePage(data) {
            const $ = cheerio.load(data);
            return $;
        }
        
        async handlePageData($) {
            const rows = $('table tbody tr');
            rows.each((idx, row) => this.parseRow($, row))
        }
    
        async parseRow($,row) {
            const id = $(row).find('td').eq(0).text().trim();
            await this.fetchAdditionalInfo(id);
        }
    
        async fetchAdditionalInfo(id) {
            const {data} = await axios.get(`${this.url}/${id}`);
            const $$ = cheerio.load(data);
            const title = $$('#main .title h2').text().trim();
            const rows = $$('#main #demoTab table tr');
            const maqam = $$(rows).eq(2).find('td').eq(1).text()?.trim();
            const rythm = $$(rows).eq(3).find('td').eq(1).text()?.trim();
            const link = $$('#sidebar ul li:contains("Télécharger la partition musicale") a').attr('href');
            const builder = new SheetBuilder();
            const sheet = builder.setTitle(title)
                .setDownloadLink(link)
                .setMaqam(maqam)
                .setRythm(rythm)
                .setUrl(link)
                .build();
            super.saveData(sheet);
        }

}

module.exports = SalahMahdiScraper;