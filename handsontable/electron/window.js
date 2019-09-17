'use strict';

const { name, version } = require('../package.json');
const { BrowserWindow, Menu, dialog } = require('electron');

const DEFAULT_PROPERTIES = {
	width: 1280,
	height: 800,
	show: false,
	title: `${name} v${version}`,
	webPreferences: {
		nodeIntegration: true
	}
};

class Window extends BrowserWindow {
	constructor({ file, ...windowSettings }) {
		super({ ...DEFAULT_PROPERTIES, ...windowSettings });

		this.buffers = [];

		let self = this;

		Menu.setApplicationMenu(require('./menu.js')(this));

		this.loadFile(file);

		if (process.env.NODE_ENV === 'development') {
			this.webContents.openDevTools();
		}

		this.once('ready-to-show', () => this.show());
	}
}

module.exports = Window;
