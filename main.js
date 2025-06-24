import { BrowserWindow, Menu, app, dialog } from "electron";
import { dirname } from 'path'
import { fileURLToPath } from "url";
import { unZipFile } from "./scripts/unzip.js";
 

const __dirname = dirname(fileURLToPath(import.meta.url))

let mainWindow

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        icon: "./icon.png",
        backgroundColor: 'rgb(37 37 37)',
        webPreferences: {
        }
    })
    if (process.env.NODE_ENV == "production") {
        mainWindow.loadFile('dist/index.html')
    } else {
        mainWindow.loadURL("http://localhost:3000")
    }
    mainWindow.once('ready-to-show', () => {
        mainWindow.maximize()
    })
}

const fileMenuTemplate = [
    {
        label: "Open slide",
        accelerator: "CTRL+O",
        click: async () => {
            
            console.log("coucou")
            let result = await dialog.showOpenDialog(mainWindow, {properties : ['openFile']})
            const file = result.filePaths
            unZipFile(file, "./presentations")
        }
    },
    { type: "separator" },
]

if (process.env.NODE_ENV != "production") {
    fileMenuTemplate.push({ role: "toggleDevTools" })
}

const appMenu = Menu.buildFromTemplate([
    {
        label: "File",
        accelerator: "CTRL+I",
        submenu: fileMenuTemplate
    },
])

Menu.setApplicationMenu(appMenu)

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

const launch = async () => {
    await app.whenReady();
    createWindow();
}

launch();