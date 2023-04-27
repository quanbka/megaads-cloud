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
    getFileContent: function (url) {
        let self = this;
        return new Promise((resolve, reject) => {
            const {
                bucket,
                file,
                destination
            } = self.getParams(url);

            if (fs.existsSync(destination)) {
                resolve(fs.readFileSync(destination));
                return;
            }
            self.checkDir(self.getFolder(destination))
            storage.bucket(bucket).file(file).download((err, contents) => {
                if (err) {
                    resolve(null);
                    console.log(`Can not download file ${file}`);
                } else {
                    resolve(contents);
                    fs.writeFile(destination, contents, err => {
                        if (err) {
                            console.log("Can not save file", err);
                        } 
                    });
                }
            });
        });
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

    getParams: function (url) {
        let bucket = 'printerval-central';
        let folders = parse.parse(url).pathname;
        folders = folders.split('/');
        folders.shift();
        if (buckets.includes(folders[0])) {
            bucket = folders.shift();
        }
        let file = folders.join('/');
        let destination = "storage/printerval-storage/" + file;
        return {
            bucket,
            file,
            destination,
        }
    },
}

module.exports = PrintervalStorage;
