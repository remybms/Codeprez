const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld("api", {
    onOpenFolder : (callback) => {
        ipcRenderer.on("open-folder", (e, data) => callback(data.content))
    }
});