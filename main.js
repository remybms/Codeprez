import { BrowserWindow, Menu, app, dialog } from "electron";
import { dirname } from 'path'
import { fileURLToPath } from "url";
import { unZipFile } from "./scripts/unzip.js";
import { ipcMain } from "electron";
import { createCodePrezArchive } from "./scripts/createArchive.js";
import path from "path";

const __dirname = dirname(fileURLToPath(import.meta.url))

let mainWindow

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        icon: "./src/app/logo/codeprez-logo.png",
        backgroundColor: 'rgb(37 37 37)',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
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
            let result = await dialog.showOpenDialog(mainWindow, {properties : ['openFile']})
            const file = result.filePaths
            unZipFile(file[0], "./presentation")
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

ipcMain.handle("select-file", async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result.filePaths[0] || null;
});

ipcMain.handle("create-archive", async (event, data) => {
  try {
    await createCodePrezArchive(data);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

const launch = async () => {
    await app.whenReady();
    createWindow();
}

launch();