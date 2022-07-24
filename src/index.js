const { app, BrowserWindow, ipcMain, Menu, screen, dialog, shell } = require('electron');
const path = require('path');
const log = require('electron-log');

const isDev = !app.isPackaged;

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        height: 800,
        width: 1200,
        minHeight: 500,
        minWidth: 500,
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
        // mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, 'renderer/dist/index.html'));
    }

    // TEMPORARY
    mainWindow.webContents.openDevTools();

    return mainWindow;
};

const createMenu = () => {
    Menu.setApplicationMenu(Menu.buildFromTemplate([]));
};

app.whenReady().then(() => {
    log.catchErrors();
    log.info('App launched.');

    if (isDev) {
        // Change the name manually in dev
        const appName = 'HOI4 Advanced Launcher';
        const appData = app.getPath('appData');

        app.setName(appName);
        app.setPath('userData', path.join(appData, appName));
    }

    const mainWindow = createWindow();

    createMenu();

    ipcMain.handleOnce('getAppLocale', () => app.getLocale());
    ipcMain.handleOnce('closeApp', () => app.quit());
    ipcMain.handleOnce('appDataPath', () => app.getPath('appData'));
    ipcMain.handleOnce('userDocumentsPath', () => app.getPath('documents'));
    ipcMain.handleOnce('appName', () => app.getName());
    ipcMain.handleOnce('isDev', () => isDev);
    ipcMain.handle('getAllDisplays', () => screen.getAllDisplays());
    ipcMain.handle('openDirectoryDialog', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory']
        });

        if (canceled) {
            return;
        } else {
            return filePaths[0];
        }
    });
    ipcMain.handle('openFolder', async (event, ...args) => {
        return await shell.openPath(...args);
    });

    ipcMain.on('close-app', () => {
        log.info('App closed.');

        app.quit();
    });

    app.on('activate', function () {
        if (0 === BrowserWindow.getAllWindows().length) {
            createWindow();
        }
    });

    log.info('Main ready.');
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        log.info('App closed.');

        app.quit();
    }
});
