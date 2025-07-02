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
    },
    requestPresentation: () => ipcRenderer.invoke("get-presentation-md"),
    requestSlidesList: () => ipcRenderer.invoke("get-slides-list"),
    requestSlideContent: (filename) => ipcRenderer.invoke("get-slide-content", filename)
});


contextBridge.exposeInMainWorld("electronAPI", {
    selectFile: (options) => ipcRenderer.invoke("select-file", options),
    createArchive: (data) => ipcRenderer.invoke("create-archive", data)
});