const { contextBridge, ipcRenderer } = require('electron');
const { getGamePath } = require('steam-game-path');
const path = require('path');
const fs = require('fs');
const log = require('electron-log');

const HOI4_APP_ID = 394360;

let allScreens = [];
let appLocale = 'en';
let appDataPath = '';
let appName = '';
let isDev = false;

async function updateScreensList() {
    return await ipcRenderer.invoke('getAllDisplays');
}

async function init() {
    allScreens = await updateScreensList();
    appLocale = await ipcRenderer.invoke('getAppLocale');
    appName = await ipcRenderer.invoke('appName');
    appDataPath = await ipcRenderer.invoke('appDataPath');
    appDataPath = path.join(appDataPath, appName);
    isDev = await ipcRenderer.invoke('isDev');

    // Create log folder if it doesn't exist
    const logsDir = path.join(appDataPath, 'logs');

    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }

    log.info('Renderer API initialized');
}

function getExecutableName() {
    let executableName;

    switch (process.platform) {
        case 'win32':
            executableName = 'hoi4.exe';
            break;
        case 'darwin':
            executableName = 'hoi4.app';
            break;
        case 'linux':
            executableName = 'hoi4';
            break;
        default:
            throw new Error(`OS ${process.platform} is not supported.`);
    }

    return executableName;
}

function isValidHoi4Folder(path) {
    if (!fs.existsSync(path)) {
        throw new Error('Invalid path.');
    }

    const folderFiles = fs.readdirSync(path);
    const hasLauncherSettings = folderFiles.some((e) => 'launcher-settings.json' === e);
    const hasGameExe = folderFiles.some((e) => getExecutableName() === e);

    return hasLauncherSettings && hasGameExe;
}

// This is just to make sure
function isValidHoi4ExecutablePath(path) {
    dirPath = path.basename(path.dirname(path));
    exeName = getExecutableName(path.split('\\').at(-1));

    return isValidHoi4Folder(dirPath) && Boolean(exeName);
}

contextBridge.exposeInMainWorld('api', {
    init: async () => await init(),
    launchHoi4: (executablePath, parameters) => {
        if (!isValidHoi4ExecutablePath(executablePath)) {
            throw new Error('Invalid HOI4 path.');
        }

        const child = require('child_process').execFile;

        child(executablePath, parameters, (err) => {
            if (err) {
                throw err;
            }
        });
    },
    getHoi4Path: () => getGamePath(HOI4_APP_ID),
    getHoi4ExecutablePath: () => {
        const dirPath = getGamePath(HOI4_APP_ID)?.game?.path;
        const executableName = getExecutableName();

        if (!dirPath) {
            return null;
        }

        return executableName ? path.join(dirPath, executableName) : null;
    },
    getAppLocale: () => appLocale,
    getTranslationFiles: () => {
        return fs
            .readdirSync(path.join(__dirname, 'renderer', 'src', 'translations'))
            .filter((fileName) => /^[a-z_\-]+.json$/.test(fileName));
    },
    getAllDisplayScreens: () => allScreens,
    updateScreensList: async () => {
        allScreens = await updateScreensList();

        return allScreens;
    },
    folderPathInput: async () => await ipcRenderer.invoke('openDirectoryDialog'),
    isValidHoi4Folder: (path) => isValidHoi4Folder(path),
    isValidHoi4Folder: (path) => isValidHoi4Folder(path),
    closeApp: () => {
        ipcRenderer.send('close-app');
    },
    getAppDataPath: () => appDataPath,
    getAppName: () => appName,
    isDev: () => isDev,
    logs: () => log.functions
});

log.info('Renderer ready.');
