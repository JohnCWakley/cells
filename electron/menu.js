'use strict';

const log = require('hogger')('menu');
const { name, version, author, license, description, homepage } = require('../package.json');
const { app, Menu, dialog } = require('electron');

function OopsBox(topic) {
	dialog.showMessageBox(null, {
		title: 'Oops!',
		message: topic.toString(),
		detail: 'Sorry, this functionality is not yet implemented.'
	})
}

module.exports = function (window) {
	return Menu.buildFromTemplate([
		{
			label: name,
			submenu: [
				{
					label: `About ${name}`,
					click: () => dialog.showMessageBox(null, {
							title: `About ${name}`,
							message: `${name} v${version} (${license})`,
							detail: `${author}\n${description}\n${homepage}`
						})
				},
				{ type: 'separator' },
				{
					label: 'Settings',
					click: () => OopsBox('Settings')
				},
				{
					label: 'Open DevTools',
					accelerator: 'CmdOrCtrl+I',
					click: () => window.webContents.openDevTools()
				},
				{ type: 'separator' },
				{
					label: 'Exit',
					accelerator: 'CmdOrCtrl+Q',
					click: () => app.quit() // TODO: need to check for changes in all windows/tabs
				}
			]
		},
		{
			label: 'File',
			submenu: [
				{
					label: 'New',
					accelerator: 'CmdOrCtrl+N',
					click: () => window.webContents.send('onFileMenuNewClicked')
				},
				{
					label: 'Open...',
					accelerator: 'CmdOrCtrl+O',
					click: () => window.webContents.send('onFileMenuOpenClicked')
				},
				{ type: 'separator' },
				{
					label: 'Save',
					accelerator: 'CmdOrCtrl+S',
					click: () => window.webContents.send('onFileMenuSaveClicked') //, widow.fm.filePath)
				},
				{
					label: 'Save As...',
					accelerator: 'Shift+CmdOrCtrl+S',
					click: () => window.webContents.send('onFileMenuSaveAsClicked')
				},
				{
					label: 'Close',
					accelerator: 'CmdOrCtrl+W',
					click: () => window.webContents.send('onFileMenuCloseClicked')
				}
			]
		}
	]);
}