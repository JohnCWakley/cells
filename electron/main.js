'use strict';

const { app } = require('electron');
const path = require('path');
const Window = require('./window.js');

if (process.env.NODE_ENV === 'development') {
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
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (win === null) {
		createWindow();
	}
});
