const axios = require('axios');
const cheerio = require('cheerio');
const BaseScraper = require('./baseScraper');

const url = 'http://dokanbach.com/shop/';
let $;

class DokanBachScraper extends BaseScraper {
    async scrape() {
        const {data} = await axios.get(url);
        $ = cheerio.load(data);
        parseList().catch(err => console.log(err));
    }
}

async function parseList() {
    const items = $('.products .product');
    console.log(items);
}

module.exports = DokanBachScraper;