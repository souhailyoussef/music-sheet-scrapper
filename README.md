# music-sheet-scrapper
A Node.js project for scraping, storing, and downloading musical sheet metadata using MongoDB and Mongoose. It includes class-based modeling with support for clean serialization/deserialization from raw JSON.

---

## 🚀 Features

- Download musical sheets from provided URLs
- Store metadata (title, composer, genre, difficulty, etc.) in MongoDB
- Customizable behavior with CLI flags:
    --json or -json(DEFAULT VALUE: false): if set, the scrapped data will be persisted into a data.json file instead of a MongoDB collection
    --dbName or -db(String): This flag allows you to specify the database name to use when saving data to MongoDB. If not specified, it defaults to "sheets".
    --download(DEFAULT VALUE: false): If set to true, the program will automatically download the sheets from the URLs specified in the metadata into the "output" directory. If set to false, the program will process the metadata but not download the actual sheet files.
    --include or -i: Specifies which scrapers to include for the scraping process. You can select multiple scrapers by passing an array of numbers (from 1 to 4). By default, all scrapers (1, 2, 3, and 4) are included. If you only want to use certain scrapers, you can specify them here.
