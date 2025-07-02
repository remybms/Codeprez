import { BrowserWindow, Menu, app, dialog, ipcMain } from "electron";
import { dirname, join } from 'path'
import { fileURLToPath } from "url";
import { unZipFile } from "./scripts/unzip.js";
import { access, readdir, readFile, constants } from "node:fs/promises";
import { separate } from "./scripts/separate.js";
import { createCodePrezArchive } from "./scripts/createArchive.js";


const __dirname = dirname(fileURLToPath(import.meta.url))

let mainWindow
const openFiles = {};

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        icon: join(__dirname, "public", "logo", "codeprez-logo.png"),
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
        const filePath = join(__dirname, "public", "slides", data);
        await access(filePath, constants.F_OK | constants.R_OK | constants.W_OK);
        const content = await readFile(filePath, { encoding: "utf-8" });
        win.webContents.send("file-content", content);
        openFiles[filePath] = content;
        win.openedFile = filePath;
    }
    catch (e) {
        dialog.showErrorBox("File not found", "Could not open requested file : " + e);
    }
})

const fileMenuTemplate = [
    {
        label: "Home page",
        accelerator: "CTRL+H",
        click: () => {
            if (mainWindow) {
                mainWindow.loadURL("http://localhost:3000");
            }
        }
    },
    {
        label: "Make a codeprez archive",
        accelerator: "CTRL+S",
        click: () => {
            if (mainWindow) {
                mainWindow.loadURL("http://localhost:3000/create-archive");
            }
        }
    },
    { type: "separator" },
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
                await unZipFile(file[0], join(__dirname, "public"))
                await separate()
                const content = (await readFile(join(__dirname, "public", "presentation.md"))).toString()
                const files = await readdir(join(__dirname, "public", "slides"))
                win.webContents.send("open-folder", { content: content, files })
            }
        }
    },
    { type: "separator" },
    
]

const presentationMenuTemplate = [
    {
        label: "Open presentation mode",
        accelerator: "CTRL+P",
        click: async () => {
            if (mainWindow) {
                const slidesDir = join(__dirname, "public", "slides");
                try {
                    const files = await readdir(slidesDir);
                    const mdFiles = files.filter(f => f.endsWith('.md'));
                    if (mdFiles.length > 0) {
                        const firstMd = mdFiles[0];
                        const content = await readFile(join(slidesDir, firstMd), { encoding: 'utf-8' });
                        mainWindow.loadURL("http://localhost:3000/open-presentation");
                        // mainWindow.webContents.removeAllListeners('did-finish-load');
                        mainWindow.webContents.on('did-finish-load', () => {
                            mainWindow.webContents.send("file-content", content);
                        });
                    } else {
                        dialog.showErrorBox("No Markdown File", "No .md file found in public/slides.");
                    }
                } catch (err) {
                    dialog.showErrorBox("Error", err.message);
                }
            }
        }
    },
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
    {
        label: "Presentation",
        accelerator: "CTRL+SHIFT+P",
        submenu: presentationMenuTemplate
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

ipcMain.handle("get-presentation-md", async () => {
    const slidesDir = join(__dirname, "public", "slides");
    try {
        const files = await readdir(slidesDir);
        const mdFiles = files.filter(f => f.endsWith('.md'));
        if (mdFiles.length > 0) {
            const firstMd = mdFiles[0];
            const content = await readFile(join(slidesDir, firstMd), { encoding: 'utf-8' });
            return { success: true, content };
        } else {
            return { success: false, error: "No .md file found in public/slides." };
        }
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle("get-slides-list", async () => {
    const slidesDir = join(__dirname, "public", "slides");
    try {
        const files = await readdir(slidesDir);
        const mdFiles = files.filter(f => f.endsWith('.md'));
        return { success: true, files: mdFiles };
    } catch (err) {
        return { success: false, error: err.message };
    }
});
ipcMain.handle("get-slide-content", async (event, filename) => {
    const slidesDir = join(__dirname, "public", "slides");
    try {
        const content = await readFile(join(slidesDir, filename), { encoding: 'utf-8' });
        return { success: true, content };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

const launch = async () => {
    await app.whenReady();
    createWindow();
}

launch();