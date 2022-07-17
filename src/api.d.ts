declare const api: {
    launchHoi4: (executablePath: string, parameters?: string[]) => void;
    getHoi4Path: () => SteamPath | null;
    getHoi4ExecutablePath: () => string | null;
};
