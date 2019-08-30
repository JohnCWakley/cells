'use strict';

const log = require('hogger')('file-manager');
const fs = require('fs');
const path = require('path');
const csvParse = require('csv-parse');
const csvStringify = require('csv-stringify');
const { EventEmitter } = require('events');
const { remote } = require('electron');
const os = require('os');
const stream = require('stream');

const DEFAULT_COLUMN_COUNT = 26;
const DEFAULT_ROW_COUNT = 128;

class Buffer extends EventEmitter {
	constructor(filePath) {
		super();

		this.window = remote.getCurrentWindow();
		this.data = [];

		for (var r = 0; r < DEFAULT_ROW_COUNT; r++) {
			let row = [];

			for (var c = 0; c < DEFAULT_COLUMN_COUNT; c++) {
				row.push(null);
			}

			this.data.push(row);
		}

		this.hasChanged = false;

		if (filePath) {
			this.readFile(filePath)
				.then(data => {
					this.data = data;
					this.emit('buffer_loaded');
				})
				.catch(err => log.error(err));
		} else {
			this.filePath = path.join(os.homedir(), 'untitled.csv');
			this.extension = path.extname(this.filePath);
			this.name = path.basename(this.filePath, this.extension);
			this.emit('buffer_loaded');
		}
	}

	readFile(filePath) {
		this.filePath = (typeof filePath === 'string') ? path.normalize(filePath) : this.filePath;
		this.extension = path.extname(this.filePath);
		this.name = path.basename(this.filePath, this.extension);

		log.debug('Buffer: readFile:', this.filePath);

		return new Promise((res, rej) => {
			var data = [];

			if (fs.existsSync(this.filePath)) {
				fs.createReadStream(this.filePath)
					.pipe(csvParse())
					.on('data', row => { data.push(row) })
					.on('end', () => res(data))
					.on('error', err => rej(err));
			} else {
				log.warn('readFile: "', this.filePath, '" does not exist.');
				res(data);
			}
		})
	}

	saveFile(filePath) {
		if (filePath) {
			// TODO: need to rename the div as well!
			this.filePath = (typeof filePath === 'string') ? path.normalize(filePath) : this.filePath;
			this.extension = path.extname(this.filePath);
			this.name = path.basename(this.filePath, this.extension);
		}

		log.debug('Buffer: saveFile:', this.filePath);

		return new Promise(async (res, rej) => {
			let ws = fs.createWriteStream(this.filePath);
			
			this.data.forEach(row => {
				let cells = [];

				row.forEach(cell => {
					cells.push(`"${cell}"`)
				})

				let s = cells.join(',') + '\n';
				ws.write(s);
			});

			ws.close();

			// await csvStringify(this.data, (err, data) => {
			// 	if (err) throw err;
			// 	ws.write(data);
			// })
			// ws.close()

			// let rs = new stream.Readable({ objectMode: true });

			// rs.pipe(csvStringigy()).pipe(ws);
			
			// this.data.forEach(row => rs.push(row));
			// rs.push(null);
			// ws.close();

			res();
		})
	}

	destroy() {
		this.data = null;
	}
}

module.exports = Buffer;