const { contextBridge, ipcRenderer } = require('electron');
const { getGamePath } = require('steam-game-path');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const log = require('electron-log');
const jsonFix = require('json-fixer');
const unhandled = require('electron-unhandled');

const { Playset } = require('./sequelize');

unhandled({
    logger: log.error,
    showDialog: true,
    reportButton: (error) => ipcRenderer.invoke('unhandledReportButton', error)
});

const HOI4_APP_ID = 394360;
const paths = {
    exePath: '',
    appDataPath: '',
    gameDataPath: '',
    logsDirPath: '',
    gameDirPath: '',
    settingsFilePath: ''
};

let apiInitialized = false;
let gameDataInitialized = false;
let allScreens = [];
let appLocale = 'en';
let appName = 'HOI4 Advanced Launcher';
let isDev = false;
let gameSettings = null;
let launchParameters = '';
let launchParametersStrictMode = true;

function throwAndLogError(errorMessage) {
    unhandled.logError(new Error(errorMessage));
}

function denyIfApiNotInitialized() {
    if (!apiInitialized) {
        throwAndLogError('Renderer API not initialized.');
    }
}

function denyIfGameDataNotInitialized() {
    if (!gameDataInitialized) {
        throwAndLogError('Game data not initialized.');
    }
}

function isValidHoi4Folder(pathName) {
    pathName = pathName ?? '';

    if (!fs.existsSync(pathName)) {
        log.error(`Invalid HOI4 folder path : "${pathName}" (does not exist).`);

        return false;
    }

    const gameFolders = [
        'browser',
        'cef',
        'common',
        'country_metadata',
        'dlc',
        'dlc_metadata',
        'events',
        'Firefox',
        'gfx',
        'history',
        'interface',
        'localisation',
        'map',
        'music',
        'pdx_browser',
        'portraits',
        'previewer_assets',
        'script',
        'sound',
        'soundtrack',
        'tutorial',
        'tweakergui_assets',
        'wiki'
    ];
    const folderFiles = fs.readdirSync(pathName);
    const hasGameFolders = gameFolders.every((f) => folderFiles.some((e) => f === e));
    const hasGameExe = folderFiles.some((e) => (getExecutableName() ? getExecutableName() === e : false));

    return hasGameFolders && hasGameExe;
}

function isValidHoi4ExecutablePath(pathName) {
    const dirPath = path.dirname(pathName);
    const exeName = paths.exePath === pathName;

    return isValidHoi4Folder(dirPath) && exeName;
}

function getExecutableName() {
    let executableName = '';

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
            log.error(`OS ${process.platform} is not supported. Cannot get executable name.`);
    }

    return executableName;
}

function parsePdxSettings(settings) {
    try {
        // Those regex could be improved in the future, but they will do for now
        // Replaces = by :
        settings = '{' + settings.replace(/=/gm, ':') + '}';
        // Put everything between ""
        settings = settings.replace(/([a-zA-Z0-9_-]+)/gm, '"$1"');
        // Removes double ""
        settings = settings.replace(/""/gm, '"');
        // Fixes colons
        const { data } = jsonFix(settings);

        data.Graphics.vsync.enabled = 'yes' === data.Graphics.vsync.enabled ? true : false;

        return data;
    } catch (e) {
        unhandled.logError(e);
    }
}

async function writePdxSettings(settings) {
    try {
        const pdxSettingsPath = path.join(paths.gameDataPath, 'pdx_settings.txt');
        let template = await fsPromises.readFile(
            path.join(__dirname, 'templates', 'pdx_settings_template.txt'),
            'utf-8'
        );

        template = template.replace(/{DISPLAY_INDEX_VALUE}/gm, settings.Graphics.display_index.value ?? '0');
        template = template.replace(/{DISPLAY_INDEX_VERSION}/gm, settings.Graphics.display_index.version ?? '0');
        template = template.replace(/{DISPLAY_MODE_VALUE}/gm, settings.Graphics.display_mode.value ?? 'fullscreen');
        template = template.replace(/{DISPLAY_MODE_VERSION}/gm, settings.Graphics.display_mode.version ?? '0');
        template = template.replace(
            /{FULLSCREEN_RESOLUTION_VALUE}/gm,
            settings.Graphics.fullscreen_resolution.value ?? '1920x1080'
        );
        template = template.replace(
            /{FULLSCREEN_RESOLUTION_VERSION}/gm,
            settings.Graphics.fullscreen_resolution.version
        );
        template = template.replace(/{VSYNC_ENABLED}/gm, settings.Graphics.vsync.enabled ? 'yes' : 'no');
        template = template.replace(/{VSYNC_VERSION}/gm, settings.Graphics.vsync.version ?? '0');
        template = template.replace(/{REFRESH_RATE_VALUE}/gm, settings.Graphics.refreshRate.value ?? '60');
        template = template.replace(/{REFRESH_RATE_VERSION}/gm, settings.Graphics.refreshRate.version ?? '0');
        template = template.replace(
            /{WINDOWED_RESOLUTION_VALUE}/gm,
            settings.Graphics.windowed_resolution.value ?? '1920x1080'
        );
        template = template.replace(
            /{WINDOWED_RESOLUTION_VERSION}/gm,
            settings.Graphics.windowed_resolution.version ?? '0'
        );
        template = template.replace(/{RENDERER_VALUE}/gm, settings.Graphics.renderer.value ?? 'dx9');
        template = template.replace(/{RENDERER_VERSION}/gm, settings.Graphics.renderer.version ?? '0');
        template = template.replace(/{LANGUAGE_VALUE}/gm, settings.System.language.value ?? 'l_english');
        template = template.replace(/{LANGUAGE_VERSION}/gm, settings.System.language.version ?? '0');

        if (!fs.existsSync(path.dirname(pdxSettingsPath))) {
            fs.mkdirSync(path.dirname(pdxSettingsPath), { recursive: true });
        }

        await fsPromises.writeFile(pdxSettingsPath, template);

        gameSettings = parsePdxSettings(template);
    } catch (e) {
        unhandled.logError(e);
    }
}

async function updateScreensList() {
    return await ipcRenderer.invoke('getAllDisplays');
}

async function readGameExePath() {
    if (!isValidHoi4Folder(paths.gameDirPath)) {
        const warnMessage = paths.gameDirPath
            ? `Invalid HOI4 folder path : ${paths.gameDirPath}`
            : 'Missing HOI4 folder path';

        log.warn(warnMessage);

        return;
    }

    try {
        let exeName;

        paths.settingsFilePath = path.join(paths.gameDirPath, 'launcher-settings.json');

        if (fs.existsSync(paths.settingsFilePath)) {
            const launcherSettingsContent = await fsPromises.readFile(paths.settingsFilePath, 'utf-8');
            const launcherSettings = JSON.parse(launcherSettingsContent);

            exeName = launcherSettings.exePath;
        }

        if (!exeName) {
            log.warn('Exe path not found in launcher-settings.json. Using fallback path...');

            exeName = getExecutableName();
        }

        paths.exePath = path.join(paths.gameDirPath, exeName);
    } catch (e) {
        unhandled.logError(e);
    }
}

async function readGameSettingsData() {
    try {
        let pdxSettingsContent = '';

        paths.gameDataPath = await ipcRenderer.invoke('userDocumentsPath');
        paths.gameDataPath = path.join(paths.gameDataPath, 'Paradox Interactive', 'Hearts of Iron IV');

        try {
            pdxSettingsContent = await fsPromises.readFile(path.join(paths.gameDataPath, 'pdx_settings.txt'), 'utf-8');

            gameSettings = parsePdxSettings(pdxSettingsContent);
        } catch (e) {
            gameSettings = null;

            log.error(e);
            log.warn('File pdx_settings.txt not found or impossible to parse settings... Settings will be default.');
        }
    } catch (e) {
        unhandled.logError(e);
    }
}

async function readGameData() {
    try {
        await readGameExePath();
        await readGameSettingsData();

        gameDataInitialized = true;
        log.info('Game data loaded.');
    } catch (e) {
        unhandled.logError(e);
    }
}

async function init() {
    try {
        isDev = await ipcRenderer.invoke('isDev');
        allScreens = await updateScreensList();
        appLocale = (await ipcRenderer.invoke('getStoreValue', 'locale')) ?? (await ipcRenderer.invoke('getAppLocale'));
        appName = await ipcRenderer.invoke('appName');
        launchParameters = await ipcRenderer.invoke('getStoreValue', 'launchParameters');
        launchParametersStrictMode = await ipcRenderer.invoke('getStoreValue', 'launchParametersStrictMode');
        paths.appDataPath = await ipcRenderer.invoke('appDataPath');
        paths.appDataPath = path.join(paths.appDataPath, appName);
        paths.gameDirPath =
            (await ipcRenderer.invoke('getStoreValue', 'hoi4DirPath')) ?? getGamePath(HOI4_APP_ID)?.game?.path;
        paths.logsDirPath = path.join(paths.appDataPath, 'logs');

        await readGameData();

        // Create log folder if it doesn't exist
        if (!fs.existsSync(paths.logsDirPath)) {
            fs.mkdirSync(paths.logsDirPath, { recursive: true });
        }

        apiInitialized = true;
        log.info('Renderer API initialized.');
    } catch (e) {
        unhandled.logError(e);
    }
}

contextBridge.exposeInMainWorld('api', {
    init: async () => await init(),
    readGameData: async () => await readGameData(),
    folderPathInput: async () => await ipcRenderer.invoke('openDirectoryDialog'),
    isValidHoi4Folder: (path) => isValidHoi4Folder(path),
    isValidHoi4ExecutablePath: (path) => isValidHoi4ExecutablePath(path),
    closeApp: () => ipcRenderer.send('close-app'),
    logs: () => log.functions,
    openLogsFolder: async () => await ipcRenderer.invoke('openFolder', paths.logsDirPath),
    getTranslationFiles: () => {
        return fs
            .readdirSync(path.join(__dirname, 'renderer', 'src', 'translations'))
            .filter((fileName) => /^[a-z_-]+.json$/.test(fileName));
    },
    launchHoi4: (parameters) => {
        denyIfApiNotInitialized();

        if (!isValidHoi4ExecutablePath(paths.exePath)) {
            throwAndLogError(`Invalid HOI4 path : ${paths.exePath}`);
        }

        const child = require('child_process');

        const hoi4Process = child.spawn(paths.exePath, parameters, { detached: true });

        hoi4Process.on('spawn', () => {
            ipcRenderer.send('close-app');
        });
    },
    getHoi4Path: () => {
        denyIfApiNotInitialized();

        return paths.gameDirPath;
    },
    getHoi4ExecutablePath: () => {
        denyIfApiNotInitialized();

        return paths.exePath;
    },
    getAppLocale: () => {
        denyIfApiNotInitialized();

        return appLocale;
    },
    getAppName: () => {
        denyIfApiNotInitialized();

        return appName;
    },
    isDev: () => {
        denyIfApiNotInitialized();

        return isDev;
    },
    getAllDisplayScreens: () => {
        denyIfApiNotInitialized();

        return allScreens;
    },
    updateScreensList: async () => {
        allScreens = await updateScreensList();

        return allScreens;
    },
    getAppDataPath: () => {
        denyIfApiNotInitialized();

        return paths.appDataPath;
    },
    getGameSettings: () => {
        denyIfGameDataNotInitialized();

        return gameSettings;
    },
    setGameSettings: async (settings) => await writePdxSettings(settings),
    setHoi4DirPath: async (path) => {
        paths.gameDirPath = path;

        await readGameExePath();
        await ipcRenderer.invoke('setStoreValue', 'hoi4DirPath', path);
    },
    findHoi4DirPath: () => getGamePath(HOI4_APP_ID)?.game?.path,
    setLocale: async (locale) => {
        appLocale = locale;
        await ipcRenderer.invoke('setStoreValue', 'locale', locale);
    },
    setLaunchParameters: async (parameters) => {
        launchParameters = parameters;
        await ipcRenderer.invoke('setStoreValue', 'launchParameters', parameters);
    },
    getLaunchParameters: () => {
        denyIfApiNotInitialized();

        return launchParameters;
    },
    setLaunchParametersStrictMode: async (strictMode) => {
        launchParametersStrictMode = strictMode;
        await ipcRenderer.invoke('setStoreValue', 'launchParametersStrictMode', strictMode);
    },
    getLaunchParametersStrictMode: () => {
        denyIfApiNotInitialized();

        return launchParametersStrictMode;
    },
    getAllPlaysets: async () => {
        return await Playset.findAll({ raw: true });
    },
    addPlayset: async (data) => {
        return (await Playset.create(data)).get({ plain: true });
    },
    updatePlayset: async (id, data) => {
        return await Playset.update(data, { where: { id: id } });
    },
    removePlayset: async (id) => {
        return await Playset.destroy({ where: { id: id } });
    }
});

log.info('Renderer ready.');
