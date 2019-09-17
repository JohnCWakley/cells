'use strict';

const { name, version } = require('../package.json');
const log = require('hogger')();
const { app } = require('electron');
const path = require('path');
const Window = require('./window.js');

log.info(`${name} v${version} initializing...`);

if (process.env.NODE_ENV === 'development') {
	log.warn('*** DEVELOPMENT ***');
	log.warn('using: electron-reload');

	require('electron-reload')(__dirname, {
		electron: require(path.join(__dirname, '..', 'node_modules', 'electron')),
		hardResetMethod: 'exit'
	});
}

function createWindow() {
	let win = new Window({ file: 'app/index.html' });
	win.on('close', () => { win = null; });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
	if (win === null) createWindow();
});
