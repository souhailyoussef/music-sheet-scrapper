const axios = require('axios');
const cheerio = require('cheerio');
const BaseScraper = require('./baseScraper');
const { SheetBuilder } = require('../model/sheet');



const axiosInstance = axios.create({
    timeout: 10000,
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'User-Agent': 'DokanBachScraper/1.0'
    }
  });

class DokanBachScraper extends BaseScraper {

    constructor(dbEnabled, dbName) {
        super(dbEnabled, dbName);
        this.url = 'http://dokanbach.com/shop/page';
    }

    async scrape() {
        const lastPage = 13;
        for (let i=1; i<=lastPage; i++) {
            const pageUrl = `${this.url}/${i}`;
            await this.fetchPage(i, pageUrl)
            .then(data => this.parsePage(data))
            .then($ => this.handlePageData($))
            .catch(err => console.log(`error scrapping page ${i}`));
        }
        await this.closeDatabaseConnection();
    }

    toString = () => 'CURRENT SCRAPER: DokanBachScraper';

    
    async fetchPage(i, url) {
    console.log(`parsing page ${i}`);
    const { data } = await axiosInstance.get(url);
    return data;
}

    async parsePage(data) {
    const $ = cheerio.load(data);
    return $;
}

    async handlePageData($) {
    const items = $('.products .product a');
    for (const elt of items) {
        const link = $(elt).attr('href');
        await this.loadSheetInfo(link);
    }
}

    async loadSheetInfo(url) {
    const {data} = await axiosInstance.get(url);
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
    await super.saveData(sheet);
 }

}

module.exports = DokanBachScraper;