const parse = require('url');


PrintervalStorage = {
    getFileContent: async function (url) {
        const {
            bucket,
            file,
            destination
        } = await this.getParams(url);
        if (fs.existsSync(destination)) {
            return fs.readFileSync(destination);
        }
        await this.prepareFolder(destination);
        await this.downloadFile(bucket, file, destination);
        if (fs.existsSync(destination)) {
            return fs.readFileSync(destination);
        } else {
            return null;
        }
    },
    getParams: async function (url) {
        return {
            bucket,
            file,
            destination,
        }
    },
}

module.exports = PrintervalStorage;
