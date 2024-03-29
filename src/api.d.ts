declare const api: {
    init: () => Promise<void>;
    readGameData: () => Promise<void>;
    folderPathInput: () => Promise<string>;
    isValidHoi4Folder: (path: string) => boolean;
    isValidHoi4ExecutablePath: (path: string) => boolean;
    closeApp: () => void;
    logs: () => import('electron-log').LogFunctions;
    openLogsFolder: () => Promise<string>;
    getTranslationFiles: () => string[];
    launchHoi4: (parameters?: string[]) => void;
    getHoi4Path: () => string | null;
    getHoi4ExecutablePath: () => string | null;
    getAppLocale: () => string;
    getAppName: () => string;
    isDev: () => boolean;
    getAllDisplayScreens: () => import('electron').Display[];
    updateScreensList: () => Promise<import('electron').Display[]>;
    getAppDataPath: () => string;
    getGameSettings: () => import('./renderer/src/lib/stores/gameSettings').PdxGameSettings | null;
    setGameSettings: (settings: import('./renderer/src/lib/stores/gameSettings').PdxGameSettings) => Promise<void>;
    setHoi4DirPath: (path: string) => Promise<void>;
    findHoi4DirPath: () => ?string;
    setLocale: (locale: string) => Promise<void>;
    setLaunchParameters: (parameters: string) => Promise<void>;
    getLaunchParameters: () => string;
    setLaunchParametersStrictMode: (strictMode: boolean) => Promise<void>;
    getLaunchParametersStrictMode: () => boolean;
    getAllPlaysets: () => Promise<import('./renderer/src/lib/stores/playsets').Playset[]>;
    addPlayset: (
        data: import('./renderer/src/lib/stores/playsets').PlaysetWithoutId
    ) => Promise<import('./renderer/src/lib/stores/playsets').Playset>;
    updatePlayset: (
        id: string | number,
        data: Partial<import('./renderer/src/lib/stores/playsets').PlaysetWithoutId>
    ) => Promise<number>;
    removePlayset: (id: string | number) => Promise<number>;
};
