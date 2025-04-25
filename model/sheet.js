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

    build() {
        return this.sheet;
    }
}

module.exports = { Sheet, SheetBuilder };
