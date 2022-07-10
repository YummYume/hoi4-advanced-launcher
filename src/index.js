// @ts-nocheck
const { app, BrowserWindow } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        height: 800,
        width: 1200,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // Prevent navigation
    mainWindow.webContents.on('will-navigate', (event) => {
        event.preventDefault();
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, 'renderer/dist/index.html'));
    }
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (0 === BrowserWindow.getAllWindows().length) {
            createWindow();
        }
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
