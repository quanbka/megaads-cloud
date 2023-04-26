const fs = require('fs');
const parse = require('url');
const {
    Storage
} = require('@google-cloud/storage');
const storage = new Storage();
const buckets = [
    'printblur-us',
    'printerval-au',
    'printerval-ca',
    'printerval-cdn',
    'printerval-central',
    'printerval-de',
    'printerval-es',
    'printerval-fr',
    'printerval-it',
    'printerval-jp',
    'printerval-mirror',
    'printerval-mount',
    'printerval-pt',
    'printerval-sg',
    'printerval-spreadshirt',
    'printerval-uk',
    'printerval-us',
    'printerval-central'
];



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

    prepareFolder: async function (destination) {
        await this.checkDir(await this.getFolder(destination))
    },

    getFolder: function (destination) {
        let paths = destination.split('/');
        paths.pop();
        return paths.join('/');
    },

    checkDir: async function (folder) {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, {
                recursive: true
            });
        }
    },

    getParams: async function (url) {
        let bucket = 'printerval-central';
        let folders = parse.parse(url).pathname;
        folders = folders.split('/');
        folders.shift();
        if (buckets.includes(folders[0])) {
            bucket = folders.shift();
        }
        let file = folders.join('/');
        let destination = "tmp/" + file;
        console.log(bucket);
        return {
            bucket,
            file,
            destination,
        }
    },

    downloadFile: async function (bucket, file, destination) {
        console.log(bucket);
        try {
            await storage.bucket(bucket).file(file).download({
                destination
            });
        } catch (error) {
            console.log(error);
            console.log(`Can not download ${file} from bucket ${bucket}`)
        }
    },

}

module.exports = PrintervalStorage;
