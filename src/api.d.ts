declare const api: {
    init: () => Promise<void>;
    launchHoi4: (executablePath: string, parameters?: string[]) => void;
    getHoi4Path: () => SteamPath | null;
    getHoi4ExecutablePath: () => string | null;
    getAppLocale: () => string;
    getTranslationFiles: () => string[];
    getAllDisplayScreens: () => import('electron').Display[];
    updateScreensList: () => Promise<import('electron').Display[]>;
    folderPathInput: () => Promise<string>;
    isValidHoi4Folder: (path: string) => boolean;
    isValidHoi4Folder: (path: string) => boolean;
    closeApp: () => void;
    getAppDataPath: () => string;
    getAppName: () => string;
    isDev: () => boolean;
    logs: () => import('electron-log').LogFunctions;
};
