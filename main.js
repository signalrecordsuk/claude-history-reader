const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// --- IPC Handlers ---

const PROJECTS_DIR = path.join(os.homedir(), '.claude', 'projects');

ipcMain.handle('scan-projects', async () => {
    try {
        const entries = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true });
        const projects = [];

        for (const entry of entries) {
            if (!entry.isDirectory()) continue;

            const dirPath = path.join(PROJECTS_DIR, entry.name);
            let files = [];
            try {
                const dirEntries = fs.readdirSync(dirPath, { withFileTypes: true });
                for (const f of dirEntries) {
                    if (f.isFile() && f.name.endsWith('.jsonl')) {
                        const fullPath = path.join(dirPath, f.name);
                        const stat = fs.statSync(fullPath);
                        files.push({
                            name: f.name,
                            path: fullPath,
                            size: stat.size,
                            mtime: stat.mtimeMs,
                        });
                    }
                }
            } catch {}

            if (files.length === 0) continue;

            // Sort by mtime descending (newest first)
            files.sort((a, b) => b.mtime - a.mtime);

            projects.push({
                dirName: entry.name,
                files,
                fileCount: files.length,
                lastModified: files[0].mtime,
            });
        }

        // Sort projects by most recently modified first
        projects.sort((a, b) => b.lastModified - a.lastModified);
        return projects;
    } catch (err) {
        return [];
    }
});

ipcMain.handle('read-file', async (_event, filePath) => {
    return fs.readFileSync(filePath, 'utf-8');
});

ipcMain.handle('write-file', async (_event, filePath, content) => {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
});

ipcMain.handle('file-exists', async (_event, filePath) => {
    return fs.existsSync(filePath);
});

ipcMain.handle('list-dir-jsonl', async (_event, dirPath) => {
    try {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        const files = [];
        for (const f of entries) {
            if (f.isFile() && f.name.endsWith('.jsonl')) {
                const fullPath = path.join(dirPath, f.name);
                const stat = fs.statSync(fullPath);
                files.push({ name: f.name, path: fullPath, mtime: stat.mtimeMs });
            }
        }
        files.sort((a, b) => a.mtime - b.mtime); // oldest first
        return files;
    } catch {
        return [];
    }
});

ipcMain.handle('browse-file', async (_event, defaultDir) => {
    const opts = {
        filters: [{ name: 'JSONL Files', extensions: ['jsonl', 'json'] }],
        properties: ['openFile'],
    };
    if (defaultDir) {
        opts.defaultPath = defaultDir;
    }
    const result = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), opts);
    if (result.canceled || result.filePaths.length === 0) return null;
    return result.filePaths[0];
});
