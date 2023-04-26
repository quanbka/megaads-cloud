import {
    readFileSync,
    existsSync,
    mkdirSync
} from 'fs';
import {
    parse
} from 'url';
import {
    Storage
} from '@google-cloud/storage';
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

// async function main() {
//     console.log(await getFileContent('https://assets.printerval.com/2022/10/14/ebb681a7-60b5-445f-a780-5cb732258d32.png'));
//     console.log(await getFileContent('https://assets.printerval.com/printerval-us/2021/11/11/618c94604267c4-291b6e09ac92c7fa28e5b4e99da0057e.jpg'));
//     console.log(await getFileContent('https://assets.printerval.com/2022/10/14/404.png'));
// }

async function getFileContent(url) {
    const {
        bucket,
        file,
        destination
    } = await getParams(url);
    await prepareFolder(destination);
    await downloadFile(bucket, file, destination);
    if (existsSync(destination)) {
        return readFileSync(destination);
    } else {
        return null;
    }

}

async function prepareFolder(destination) {
    await checkDir(await getFolder(destination))
}

async function getFolder(destination) {
    let paths = destination.split('/');
    paths.pop();
    return paths.join('/');
}

async function checkDir(folder) {
    if (!existsSync(folder)) {
        mkdirSync(folder, {
            recursive: true
        });
    }
}

async function getParams(url) {
    let bucket = 'printerval-central';
    let folders = parse(url).pathname;
    folders = folders.split('/');
    folders.shift();

    if (buckets.includes(folders[0])) {
        bucket = folders.shift();
    }

    let file = folders.join('/');
    let destination = "tmp/" + file;
    return {
        bucket,
        file,
        destination,
    }
}

async function downloadFile(bucket, file, destination) {
    try {
        await storage.bucket(bucket).file(file).download({
            destination
        });
    } catch (error) {
        console.log(`Can not download ${file} from bucket ${bucket}`)
    }
}

// await main();