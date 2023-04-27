const storage = require('./index');

async function main () {
    // console.time("main");
    console.log(await storage.getFileContent('https://assets.printerval.com/2022/10/14/ebb681a7-60b5-445f-a780-5cb732258d32.png')) // return as buffer
    // console.timeEnd("main");
    console.log(await storage.getFileContent('https://assets.printerval.com/2022/10/14/404.png')) // return as buffer
}

main ();
