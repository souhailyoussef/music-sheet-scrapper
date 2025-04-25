const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadFile(url, filename) {
    const writer = fs.createWriteStream(path.resolve(__dirname, filename));

    const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'blob'
    })

    response.data.pip(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', () => {
            console.log('download completed');
            resolve();
        })
        writer.on('error', reject)
    })
}

module.exports = {downloadFile};