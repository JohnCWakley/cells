const fs = require('fs');
const readline = require('readline');

let rl = readline.createInterface({
    input: fs.createReadStream('test.csv')
});

let rows = [];
let widths = [];
let spaces = [];

function createRow(data, justification) {
    justification = justification || 'left'

    let row = '|'

    if (typeof data === 'string') {
        data = data.split(',')
    }

    data.forEach((cell, i) => {
        if (justification == 'right') {
            row += (' ' + cell.padStart(widths[i], ' ') + ' |')//((spaces[i] + cell).slice(spaces[i].length)) + ' | '
        } else if (justification == 'center') {
            
        } else {
            row += (' ' + cell.padEnd(widths[i], ' ') + ' |')//((cell + spaces[i]).slice(0, spaces[i].length)) + ' | '
        }
    })

    return row;
}

rl.on('line', line => {
    rows.push(line);

    if (widths.length == 0) {
        line.split(',').forEach(cell => {
            widths.push(cell.length);
            spaces.push('');
        });
    }
});


rl.on('close', () => {
    console.log('rows:', rows);

    rows.forEach(cells => {
        cells.split(',').forEach((cell, i) => {
            if (widths[i] < cell.length) {
                widths[i] = cell.length;
                spaces[i] = '';

                for (var ii = 0; ii < cell.length; ii++) {
                    spaces[i] += ' ';
                }
            }
        });
    });

    let hBorder = '+';

    widths.forEach(width => {
        hBorder += '--';

        for (var i = 0; i < width; i++) {
            hBorder += '-'
        }

        hBorder += '+'
    })


    let headerRow = createRow(rows.shift(), 'center')
    
    console.log(hBorder);
    console.log(headerRow);
    console.log(hBorder);

    rows.forEach(row => {
        console.log(createRow(row, 'right'))
    })

    console.log(hBorder);
});

