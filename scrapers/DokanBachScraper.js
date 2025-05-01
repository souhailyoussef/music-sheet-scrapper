const axios = require('axios');
const cheerio = require('cheerio');
const BaseScraper = require('./baseScraper');
const { SheetBuilder } = require('../model/sheet');
const {appendToFile} = require('../util/fileWriter');


const url = 'http://dokanbach.com/shop/page';

class DokanBachScraper extends BaseScraper {
    async scrape() {
        const lastPage = 13;
        for (let i=1; i<=lastPage; i++) {
            const pageUrl = `${url}/${i}`;
            await fetchPage(pageUrl)
            .then(parsePage)
            .then(handlePageData)
            .catch(err => console.log(`error scrapping page ${i}`));
        }
    }

    toString = () => 'CURRENT SCRAPER: DokanBachScraper';
}

async function fetchPage(url) {
    const { data } = await axios.get(url);
    return data;
}

function parsePage(data) {
    const $ = cheerio.load(data);
    return $;
}

async function handlePageData($) {
    const items = $('.products .product a');
    for (const elt of items) {
        const link = $(elt).attr('href');
        await loadSheetInfo(link);
    }
}

 async function loadSheetInfo(url) {
    const {data} = await axios.get(url);
    const $$ = cheerio.load(data);
    const btn = $$('.et_pb_button_0');
    const link = btn.attr('href');
    const info = $$('.et_pb_module_inner ul');
    const composer = info.find('li').first(); 
    const title = $$('.et-db #et-boc .et-l .et_pb_wc_title h1').text().trim();
    const builder = new SheetBuilder();
    const sheet = builder
         .setTitle(title)
         .setComposer(composer.text().trim().replace('Music composed by ', ''))
         .setDifficulty()
         .setDownloadLink(link)
         .setGenre()
         .setParts()
         .setUrl(url)
         .build();
    appendToFile(sheet);
 }

module.exports = DokanBachScraper;