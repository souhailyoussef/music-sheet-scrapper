const { appendToFile } = require('../util/fileWriter');

class BaseScraper {

    constructor(dbEnabled, dbName) {
        this.dbEnabled = dbEnabled;
        this.dbName = dbName;
      }
    
  

      async saveData(sheet) {
        if (this.dbEnabled) {
          const sheetDoc = sheet.toModel();
          await sheetDoc.save();
        } else {
          appendToFile(sheet);
        } 
      }
    
      async closeDatabaseConnection() {
        if (this.client) {
          await this.client.close();
        }
      }

    async scrape() {
        throw new Error("scrape method must be implemented");
    }

    toString() {
        return 'CURRENT SCRAPER :';
    }
}

module.exports = BaseScraper;