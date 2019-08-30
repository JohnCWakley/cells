const log = require('hogger')('app');
const { ipcRenderer } = require('electron');
const Buffer = require('./buffer.js');
const Handsontable = require('handsontable');
const { remote } = require('electron');
const path = require('path');

class App {
	constructor() {
		this.buffers = [];

		ipcRenderer.on('onFileMenuNewClicked', this.createNewFile.bind(this));
		ipcRenderer.on('onFileMenuOpenClicked', this.openFile.bind(this));
		ipcRenderer.on('onFileMenuSaveClicked', this.saveFile.bind(this));
		ipcRenderer.on('onFileMenuSaveAsClicked', this.saveFileAs.bind(this));
		ipcRenderer.on('onFileMenuCloseClicked', this.closeFile.bind(this));
	}

	createNewFile(evt) {
		let buffer = new Buffer();

		buffer.on('buffer_loaded', () => {
			this.focusedFileManager = buffer;
			this.updateWindow();
		});

		this.focusedFileManager = buffer;
		this.buffers.push(buffer);

		this.updateWindow();
	}

	openFile(evt) {
		remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
			multiSelections: false,
			showHiddenFiles: true,
			createDirectory: false,
			treatPackageAsDirectory: true,
			properties: ["openFile"]
		})
			.then(result => {
				if (!result.canceled) {
					let filePath = null;

					if (result.filePaths instanceof Array) {
						if (result.filePaths.length > 0) {
							filePath = result.filePaths[0];
						}
					}

					if (filePath !== null) {
						let buffer = new Buffer(filePath);

						buffer.on('buffer_loaded', () => {
							this.focusedFileManager = buffer;
							this.updateWindow();
						});

						this.buffers.push(buffer);
					}
				}
			})
			.catch(err => log.error(err));
	}

	saveFile(evt) {
		if (this.buffers.length > 0) {
			if (!this.focusedFileManager) {
				this.focusedFileManager = this.buffers[0];
			}

			this.focusedFileManager.saveFile();
		}
	}

	saveFileAs(evt) {
		if (this.buffers.length > 0) {
			if (!this.focusedFileManager) {
				this.focusedFileManager = this.buffers[0];
			}

			remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
				defaultPath: this.focusedFileManager.filePath
			})
				.then(result => {
					if (!result.canceled) {
						let filePath = result.filePath;
						let ext = path.extname(filePath);

						if (!ext) {
							ext = '.csv';
							filePath += ext;
						}

						this.focusedFileManager.saveFile(filePath);
					}
				})
				.catch(err => log.error(err));
		}
	}

	closeFile(evt) {
		if (this.focusedFileManager) {
			let ele = document.querySelector(`div#${this.focusedFileManager.name}`);

			if (ele) {
				ele.parentElement.removeChild(ele);
				this.focusedFileManager.destroy();
				this.buffers.shift();

				if (this.buffers.length > 0) {
					this.focusedFileManager = this.buffers[0];
				}
			}
		}
	}

	updateWindow() {
		this.buffers.forEach(buffer => {
			let container = document.querySelector(buffer.name);

			if (!container) {
				container = document.createElement('div');
				container.id = buffer.name;
				document.body.appendChild(container);

				let table = new Handsontable.default(container, {
					data: buffer.data,
					rowHeaders: true,
					colHeaders: true,
					filters: true,
					dropdownMenu: true,
					licenseKey: 'non-commercial-and-evaluation'
				});
			}
		});
	}
}

module.exports = App;