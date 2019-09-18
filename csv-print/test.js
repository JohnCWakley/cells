const columnize = require('./columnize.js');
const fs = require('fs');
const readline = require('readline');

function readRowsFromFile(filename) {
    return new Promise((res, rej) => {
        let rows = [];
        let rl = readline.createInterface({ input: fs.createReadStream(filename) });
        rl.on('line', line => rows.push(line));
        rl.on('close', () => res(rows));
    });
}

readRowsFromFile('test.csv').then(rows => {
    console.log(columnize(rows));
});
