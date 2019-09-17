'use strict';

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
							detail: `${author.name} <${author.email}>\n${description}\n${homepage}`
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
					click: () => window.webContents.send('on_file_new_clicked')
				},
				{
					label: 'Open...',
					accelerator: 'CmdOrCtrl+O',
					click: () => window.webContents.send('on_file_open_clicked')
				},
				{ type: 'separator' },
				{
					label: 'Save',
					accelerator: 'CmdOrCtrl+S',
					click: () => window.webContents.send('on_file_save_clicked')
				},
				{
					label: 'Save As...',
					accelerator: 'Shift+CmdOrCtrl+S',
					click: () => window.webContents.send('on_file_save_as_clicked')
				},
				{
					label: 'Close',
					accelerator: 'CmdOrCtrl+W',
					click: () => window.webContents.send('on_file_close_clicked')
				}
			]
		}
	]);
}