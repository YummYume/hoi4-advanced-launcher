const { app, BrowserWindow, ipcMain, Menu, screen, dialog, shell } = require('electron');
const path = require('path');
const log = require('electron-log');
const Store = require('electron-store');
const unhandled = require('electron-unhandled');
const fs = require('fs');

const isDev = !app.isPackaged;
const lock = app.requestSingleInstanceLock();

if (!lock) {
    app.quit();
} else {
    const createWindow = (sizes = [null, null]) => {
        const mainWindow = new BrowserWindow({
            width: sizes[0] ?? 1200,
            height: sizes[1] ?? 800,
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
            mainWindow.webContents.openDevTools();
        } else {
            mainWindow.loadFile(path.join(__dirname, 'renderer/dist/index.html'));
        }

        // TEMPORARY
        // mainWindow.webContents.openDevTools();

        return mainWindow;
    };

    const createMenu = () => {
        Menu.setApplicationMenu(Menu.buildFromTemplate([]));
    };

    const unhandledReportButton = (error) => {
        const logsDir = path.join(app.getPath('userData'), 'logs');
        const url = new URL('https://github.com/YummYume/hoi4-advanced-launcher/issues/new');

        url.searchParams.append('title', `Unhandled error : ${error.message}`);
        url.searchParams.append('body', `Stack : \n\`\`\`\n${error.stack}\n\`\`\`\n\nOS : ${process.platform}`);

        if (fs.existsSync(logsDir)) {
            shell.openPath(logsDir);
        }

        shell.openExternal(url.href);
    };

    app.whenReady().then(() => {
        log.info('App launched.');

        if (isDev) {
            // Change the name manually in dev
            const appName = 'HOI4 Advanced Launcher';
            const appData = app.getPath('appData');

            app.setName(appName);
            app.setPath('userData', path.join(appData, appName));
        }

        unhandled({
            logger: log.error,
            showDialog: true,
            reportButton: (error) => unhandledReportButton(error)
        });

        const storeSchema = {
            locale: {
                type: 'string'
            },
            hoi4DirPath: {
                type: 'string'
            },
            launchParameters: {
                type: 'string',
                default: ''
            },
            launchParametersStrictMode: {
                type: 'boolean',
                default: true
            },
            windowWidth: {
                type: 'number',
                minimum: 500,
                default: 1200
            },
            windowHeight: {
                type: 'number',
                minimum: 500,
                default: 800
            },
            firstLaunch: {
                type: 'boolean',
                default: true
            }
        };
        const store = new Store({
            schema: storeSchema,
            encryptionKey: 'S4XgGKT5j8iUT87TgprZVJdp66ANx5fs',
            clearInvalidConfig: true
        });
        const initialWindowWidth = store.get('windowWidth');
        const initialWindowHeight = store.get('windowHeight');
        const mainWindow = createWindow([initialWindowWidth, initialWindowHeight]);

        let windowWidth = initialWindowWidth;
        let windowHeight = initialWindowHeight;

        createMenu();

        ipcMain.handleOnce('getAppLocale', () => app.getLocale());
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
        ipcMain.handle('openFolder', async (event, path) => {
            return await shell.openPath(path);
        });
        ipcMain.handle('openUrl', async (event, url) => {
            return await shell.openExternal(url);
        });
        ipcMain.handle('unhandledReportButton', async (event, error) => {
            unhandledReportButton(error);
        });
        ipcMain.handle('getStoreValue', (event, key) => {
            return store.get(key);
        });
        ipcMain.handle('setStoreValue', (event, ...args) => {
            store.set(...args);
        });

        mainWindow.on('resize', () => {
            const sizes = mainWindow.getSize();

            windowWidth = sizes[0];
            windowHeight = sizes[1];
        });

        ipcMain.on('close-app', () => {
            store.set('windowWidth', windowWidth);
            store.set('windowHeight', windowHeight);

            log.info('App closed.');

            app.quit();
        });

        app.on('second-instance', () => {
            if (mainWindow) {
                if (mainWindow.isMinimized()) {
                    mainWindow.restore();
                }

                mainWindow.focus();
            }
        });

        app.on('activate', () => {
            if (0 === BrowserWindow.getAllWindows().length) {
                createWindow();
            }
        });

        app.on('window-all-closed', () => {
            store.set('windowWidth', windowWidth);
            store.set('windowHeight', windowHeight);

            if (process.platform !== 'darwin') {
                log.info('App closed.');

                app.quit();
            }
        });

        log.info('Main ready.');
    });
}
