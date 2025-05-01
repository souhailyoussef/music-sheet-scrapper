const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { SheetModel, Sheet } = require('../model/sheet');
const mime = require('mime-types');

const outputPath = path.join(__dirname, '..', 'output');

async function downloadFile(url, filename) {
    try {
    const response = await axios.get(url, { responseType: 'stream' });
    const contentType = response.headers['content-type'];
    let extension = mime.extension(contentType) || 'bin';
    const filePath = path.resolve(outputPath, `${filename}.${extension}`);
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        resolve();
      });
      writer.on('error', reject);
    });
  } catch (error) {
  }
}
  


async function downloadAll(output) {
    let sheets = [];
    if (output) {
        sheets = await SheetModel.find({}, 'url title composer downloadLink').lean();
        sheets = sheets.filter(s => s.downloadLink);
    } else {
        const raw = fs.readFileSync(path.join(outputPath, 'data.json'), 'utf8');
        sheets = JSON.parse(raw || '[]').map(obj => Sheet.fromRawObject(obj));
        sheets = sheets.filter(s => s.downloadLink);
    }
    const total = sheets.length;
    let current = 0;
    let successCount = 0;
    let failCount = 0;
    for (const sheet of sheets) {
        current++;
        if (!sheet.downloadLink) {
            console.log(sheet);
            continue;
        }
        try {
            console.log(`downloading ${current}/${total}...`)
            await downloadFile(sheet.downloadLink, sheet.title);
            successCount++;
        } catch (err) {
            failCount++;
            console.error(`❌ Failed to download: ${sheet.url}`, err.message);
        }
    }
    console.log(`\nDownload complete.`);
    console.log(`✅ ${successCount} files downloaded successfully`);
    console.log(`❌ ${failCount} files failed`);
}

module.exports = {downloadAll};