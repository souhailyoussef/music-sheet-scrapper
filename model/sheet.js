const {mongoose} = require('../util/db');

const sheetSchema = new mongoose.Schema({
    title: String,
    composer: String,
    genre: String,
    difficulty: String,
    parts: String,
    url: String,
    downloadLink: String,
    maqam: String,
    rythm: String
  }, {timestamps: true});

  
const SheetModel = mongoose.model('Sheet', sheetSchema);


class Sheet {
    constructor() {}

    set title(title) {
        this._title = title;
    }
    get title() {
        return this._title;
    }

    set composer(composer) {
        this._composer = composer;
    }
    get composer() {
        return this._composer;
    }

    set genre(genre) {
        this._genre = genre;
    }
    get genre() {
        return this._genre;
    }

    set difficulty(difficulty) {
        this._difficulty = difficulty;
    }
    get difficulty() {
        return this._difficulty;
    }

    set parts(parts) {
        this._parts = parts;
    }
    get parts() {
        return this._parts;
    }

    set url(url) {
        this._url = url;
    }

    get url() {
        return this._url;
    }

    set downloadLink(downloadLink) {
        this._downloadLink = downloadLink;
    }

    get downloadLink() {
        return this._downloadLink;
    }

    set maqam(maqam) {
        this._maqam = maqam;
    }

    get maqam() {
        return this._maqam;
    }

    set rythm(rythm) {
        this._rythm = rythm;
    } 

    get rythm() {
        return this._rythm;
    }

    toModel() {
        return new SheetModel({
            title: this.title,
            composer: this.composer,
            genre: this.genre,
            difficulty: this.difficulty,
            parts: this.parts,
            url: this.url,
            downloadLink: this.downloadLink,
            maqam: this.maqam,
            rythm: this.rythm,
        });
    }

    static fromRawObject(obj) {
        const sheet = new Sheet();
    
        for (const key in obj) {
            if (key.startsWith('_')) {
                const publicKey = key.slice(1);
                if (publicKey in sheet) {
                    sheet[publicKey] = obj[key];
                }
            }
        }
        return sheet;
    }
}

class SheetBuilder {
    constructor() {
        this.sheet = new Sheet();
    }

    setTitle(title) {
        this.sheet.title = title;
        return this;
    }

    setComposer(composer) {
        this.sheet.composer = composer;
        return this;
    }

    setGenre(genre) {
        this.sheet.genre = genre;
        return this;
    }

    setDifficulty(difficulty) {
        this.sheet.difficulty = difficulty;
        return this;
    }

    setParts(parts) {
        this.sheet.parts = parts;
        return this;
    }

    setUrl(url) {
        this.sheet.url = url;
        return this;
    }

    setDownloadLink(downloadLink) {
        this.sheet.downloadLink = downloadLink;
        return this;
    }

    setMaqam(maqam) {
        this.sheet.maqam = maqam;
        return this;
    }

    setRythm(rythm) {
        this.sheet.rythm = rythm;
        return this;
    }

    build() {
        return this.sheet;
    } 
}

module.exports = { Sheet, SheetBuilder, SheetModel};
