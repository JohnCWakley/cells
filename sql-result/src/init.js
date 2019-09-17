const headers = [ 'one', 'two', 'three', 'four', 'five' ];

const data = [
    [ 'a', 'b', 'c', 'd', 'e' ],
    [ 'f', 'g', 'h', 'i', 'j' ],
    [ 'k', 'l', 'm', 'n', 'o' ],
    [ 'p', 'q', 'r', 's', 't' ],
    [ 'u', 'v', 'w', 'x', 'y' ]
];

let thead = document.querySelector('thead');

if (thead) {
    let row = document.createElement('tr')

    headers.forEach(header => {
        let cell = document.createElement('th')
        cell.innerText = header
        row.appendChild(cell)
    })

    thead.appendChild(row)
}

let tbody = document.querySelector('tbody')

if (tbody) {
    data.forEach(dataRow => {
        let row = document.createElement('tr')
        
        dataRow.forEach(dataCell => {
            let cell = document.createElement('td')
            cell.innerText = dataCell
            row.appendChild(cell)
        })
        
        thead.appendChild(row)
    })
}


console.log('init.js loaded');