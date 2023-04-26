const fs = require('fs');
const parse = require('url');
const axios = require('axios');

PrintervalStorage = {
    getFileContent: async function (url) {
        const {
            destination
        } = this.getParams(url);
        if (fs.existsSync(destination)) {
            return fs.readFileSync(destination);
        }
        await this.prepareFolder(destination);
        return this.downloadFile(url, destination);
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

    getParams: function (url) {
        let folders = parse.parse(url).pathname;
        folders = folders.split('/');
        folders.shift();
        let file = folders.join('/');
        let destination = "storage/printerval-storage/" + file;
        return {
            destination,
        }
    },

    downloadFile: function (url, destination) {
        return new Promise((resolve, reject) => {
            axios({
                url: url,
                method: 'GET',
                responseType: 'arraybuffer'
            }).then(response => {
                resolve(Buffer.from(response.data, 'binary'));
                fs.writeFile(destination, response.data, (error) => {
                    if (error) console.log('Can not write file: ', error);
                });
            }).catch(function (error) {
                console.log('Can not download file: ', error);
                reject(error);
            });
        })


    },
}

module.exports = PrintervalStorage;
