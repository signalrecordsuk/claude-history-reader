const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    scanProjects: () => ipcRenderer.invoke('scan-projects'),
    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
    writeFile: (filePath, content) => ipcRenderer.invoke('write-file', filePath, content),
    fileExists: (filePath) => ipcRenderer.invoke('file-exists', filePath),
    listDirJsonl: (dirPath) => ipcRenderer.invoke('list-dir-jsonl', dirPath),
    browseFile: (defaultDir) => ipcRenderer.invoke('browse-file', defaultDir),
});
