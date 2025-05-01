var fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, '..', 'output');
const filePath = path.join(folderPath, 'data.json');

if (!fs.existsSync(filePath)) {
        console.log(`**************** ${filePath} file doesnt exist, creating file! ****************`)
        fs.mkdirSync(folderPath, { recursive: true });
        fs.writeFileSync(filePath , '[]','utf8');
        console.log(`**************** ${filePath} file created! ****************`)
} else {
    console.log('\n **************** content of file has been erased ****************\n');
    fs.writeFileSync(filePath,'[]' ,'utf8');
}

function appendToFile(item) {
    let data = [];
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        data = JSON.parse(fileContent || '[]');
    } catch (e) {
        console.error('error reading file');
        data = [];
    }
    data.push(item);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {appendToFile};