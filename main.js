import { BrowserWindow, Menu, app, dialog, ipcMain } from "electron";
import { dirname, join } from 'path'
import { fileURLToPath } from "url";
import { unZipFile } from "./scripts/unzip.js";
import { access, readdir, readFile, constants } from "node:fs/promises";
import { separate } from "./scripts/separate.js";


const __dirname = dirname(fileURLToPath(import.meta.url))

let mainWindow
const openFiles = {};

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        icon: "./icon.png",
        backgroundColor: 'rgb(37 37 37)',
        webPreferences: {
            preload: join(__dirname, "preload.js"),
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

ipcMain.on("open-file", async (e, data) => {
    try {
        const win = BrowserWindow.getFocusedWindow();
        const path = join('./public/slides/', data);
        await access(path, constants.F_OK | constants.R_OK | constants.W_OK);
        const content = await readFile(path, { encoding: "utf-8" });
        win.webContents.send("file-content", content);
        openFiles[path] = content;
        win.openedFile = path;
    }
    catch (e) {
        dialog.showErrorBox("File not found", "Could not open requested file : " + e);
    }
})

const fileMenuTemplate = [
    {
        label: "Open slide",
        accelerator: "CTRL+O",
        click: async () => {
            const win = BrowserWindow.getFocusedWindow();
            let result = await dialog.showOpenDialog(mainWindow, {
                properties: ['openFile'],
                filters: [{ name: "Codeprez", extensions: ['codeprez'] }]
            })
            if (!result.canceled) {
                const file = result.filePaths
                await unZipFile(file[0], "./public")
                await separate()
                const content = (await readFile(`./public/presentation.md`)).toString()
                const files = await readdir('./public/slides')
                win.webContents.send("open-folder", { content: content, files })
            }
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