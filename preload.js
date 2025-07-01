const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld("api", {
    onOpenFolder : (callback) => {
        ipcRenderer.on("open-folder", (e, data) => callback(data.content, data.files))
    },
    openFile : (fileName) => {
        ipcRenderer.send("open-file",fileName);
    },
    onFileContent : (callback) => {
        ipcRenderer.on("file-content",(e,data) => {
            callback(data);
        })
    }
});