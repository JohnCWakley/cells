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

class FileManager extends EventEmitter {
	constructor(filePath) {
		super();

		this.window = remote.getCurrentWindow();
		this.buffer = [];

		for (var r = 0; r < DEFAULT_ROW_COUNT; r++) {
			let row = [];

			for (var c = 0; c < DEFAULT_COLUMN_COUNT; c++) {
				row.push(null);
			}

			this.buffer.push(row);
		}

		this.hasChanged = false;

		if (filePath) {
			this.readFile(filePath)
				.then(buffer => {
					this.buffer = buffer;
					this.emit('fileManagerLoaded');
				})
				.catch(err => log.error(err));
		} else {
			this.filePath = path.join(os.homedir(), 'untitled.csv');
			this.extension = path.extname(this.filePath);
			this.name = path.basename(this.filePath, this.extension);
			this.emit('fileManagerLoaded');
		}
	}

	readFile(filePath) {
		this.filePath = (typeof filePath === 'string') ? path.normalize(filePath) : this.filePath;
		this.extension = path.extname(this.filePath);
		this.name = path.basename(this.filePath, this.extension);

		log.debug('FileManager: readFile:', this.filePath);

		return new Promise((res, rej) => {
			var buffer = [];

			if (fs.existsSync(this.filePath)) {
				fs.createReadStream(this.filePath)
					.pipe(csvParse())
					.on('data', row => { buffer.push(row) })
					.on('end', () => res(buffer))
					.on('error', err => rej(err));
			} else {
				log.warn('readFile: "', this.filePath, '" does not exist.');
				res(buffer);
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

		log.debug('FileManager: saveFile:', this.filePath);

		return new Promise(async (res, rej) => {
			let ws = fs.createWriteStream(this.filePath);
			await csvStringify(this.buffer, (err, data) => {
				if (err) throw err;
				ws.write(data);
			})
			ws.close()
			// let rs = new stream.Readable({ objectMode: true });

			// rs.pipe(csvStringigy()).pipe(ws);
			
			// this.buffer.forEach(row => rs.push(row));
			// rs.push(null);
			// ws.close();

			res();
		})
	}

	destroy() {
		this.buffer = null;
	}
}

module.exports = FileManager;