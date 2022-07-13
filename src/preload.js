const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
    launchHoi4: function (executablePath, parameters) {
        const child = require('child_process').execFile;

        child(executablePath, parameters, function (err) {
            if (err) {
                throw err;
            }
        });
    }
});
