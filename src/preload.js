const { contextBridge } = require('electron');
const { getGamePath } = require('steam-game-path');
const path = require('path');

const HOI4_APP_ID = 394360;

contextBridge.exposeInMainWorld('api', {
    launchHoi4: function (executablePath, parameters) {
        const child = require('child_process').execFile;

        child(executablePath, parameters, function (err) {
            if (err) {
                throw err;
            }
        });
    },
    getHoi4Path: () => getGamePath(HOI4_APP_ID),
    getHoi4ExecutablePath: function () {
        const dirPath = getGamePath(HOI4_APP_ID)?.game?.path;

        if (!dirPath) {
            return null;
        }

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

        return executableName ? path.join(dirPath, executableName) : null;
    }
});
