class BaseScraper {
    async scrape() {
        throw new Error("scrape method must be implemented");
    }
}

module.exports = BaseScraper;