const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  scrape: (url) => ipcRenderer.invoke('scrape', url),
  aiResearch: (query) => ipcRenderer.invoke('aiResearch', query),
});