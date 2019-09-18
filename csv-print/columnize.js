module.exports = function (rows, params) {
    params = params || {};

    let delimiter = params.delimiter || ',';
    let borderHorizontal = params.borderHorizontal || '-';
    let borderVertical = params.borderVertical || '|';
    let borderIntersection = params.borderIntersection || '+';
    let paddingCharacter = params.paddingCharacter || ' ';
    let paddingAmount = params.paddingAmount !== undefined ? params.paddingAmount : 1;
    let regex = params.regex || /["]+/g;
    let header = (params.header !== false);
    let headerJustify = params.headerJustify || 'left';
    let cellsJustify = params.cellsJustify || 'right';

    if (rows instanceof Array) {
        if (rows[0] instanceof Array || typeof rows[0] === 'string') {
            rows = normalizeRows(rows, regex, delimiter);

            let maxWidths = getMaxCellWidths(rows);
            let separator = buildSeperator(maxWidths, paddingAmount, borderHorizontal, borderIntersection);
            let tableRows = [];

            tableRows.push(separator);

            if (header) {
                tableRows.push(createRow(rows.shift(), maxWidths, paddingAmount, paddingCharacter, headerJustify, borderVertical));
                tableRows.push(separator);
            }

            rows.forEach(row => tableRows.push(createRow(row, maxWidths, paddingAmount, paddingCharacter, cellsJustify, borderVertical)))
            tableRows.push(separator);
            
            rows = tableRows.join('\n');
        }
    }

    return rows;
}

function normalizeRows(rows, regex, delimiter) {
    for (var i = 0; i < rows.length; i++) {
        if (typeof rows[i] === 'string') {
            rows[i] = rows[i].split(delimiter);
        }

        for (var j = 0; j < rows[i].length; j++) {
            rows[i][j] = rows[i][j].replace(regex, '').trim();
        }
    }

    return rows;
}

function getMaxCellWidths(rows) {
    let widths = [];

    rows[0].forEach(cell => {
        widths.push(cell.length);
    });

    rows.forEach(cells => {
        cells.forEach((cell, i) => {
            if (widths[i] < cell.length) {
                widths[i] = cell.length;
            }
        });
    });

    return widths;
}

function buildSeperator(widths, paddingAmount, borderHorizontal, borderIntersection) {
    let separator = [];

    widths.forEach(width => separator.push(borderHorizontal.repeat(width + paddingAmount * 2)));

    return `${borderIntersection}${separator.join(borderIntersection)}${borderIntersection}`
}

function createRow(data, widths, paddingAmount, paddingCharacter, justification, borderVertical) {
    let row = []

    data.forEach((cell, i) => row.push(cell[ justification === 'right' ? 'padStart' : 'padEnd' ](widths[i], paddingCharacter)));

    return `${borderVertical}${paddingCharacter.repeat(paddingAmount)}${row.join(paddingCharacter.repeat(paddingAmount) + borderVertical + paddingCharacter.repeat(paddingAmount))}${paddingCharacter.repeat(paddingAmount)}${borderVertical}`
}
