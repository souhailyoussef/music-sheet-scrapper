const cheerio = require('cheerio');
const BaseScraper = require('./baseScraper');
const {appendToFile} = require('../util/fileWriter');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const { SheetBuilder } = require('../model/sheet');


url = 'https://www.salahelmahdi.com/musique'
batch = 10;
var $;
var browser;
class SalahMahdiScraper extends BaseScraper {


    async scrape() {
        const totalPages = await countTotal(url);
        console.log(`${totalPages} pages to scrape...`);
        for (let currPage=1; currPage<=5; currPage++) {
            await fetchPage(currPage, url)
            .then(parsePage)
            .then(handlePageData);
        }
        
    }

    toString = () => 'CURRENT SCRAPER: SalahMahdiScraper';

}

async function countTotal(url) {
    browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(`${url}`, {waitUntil: 'networkidle2'});
    const content = await page.content();
    const $$$ = cheerio.load(content);
    total = $$$('ul.pagination li').eq(-2).find('a').text().trim();
    return total;
}

 async function fetchPage(index, url) {
        console.log(`scrapping page ${index}`);
        const page = await browser.newPage();
        await page.goto(`${url}?page=${index}`, {waitUntil: 'networkidle2'});
        const content = await page.content();
        page.close();
        return content;
    }
    
    function parsePage(data) {
        $ = cheerio.load(data);
        return $;
    }
    
    async function handlePageData() {
        const rows = $('table tbody tr');
        rows.each((idx, row) => parseRow(row))
    }

    async function parseRow(row) {
        const id = $(row).find('td').eq(0).text().trim();
        await fetchAdditionalInfo(id);
    }

    async function fetchAdditionalInfo(id) {
        const page = await browser.newPage();
        await page.goto(`${url}/${id}`, {waitUntil: 'networkidle2'});
        const content = await page.content();
        page.close();
        const $$ = cheerio.load(content);
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
        appendToFile(sheet);
    }


module.exports = SalahMahdiScraper;