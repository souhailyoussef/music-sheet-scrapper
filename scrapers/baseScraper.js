class BaseScraper {
    async scrape() {
        throw new Error("scrape method must be implemented");
    }

    toString() {
        return 'CURRENT SCRAPER :';
    }
}

module.exports = BaseScraper;