const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getPartners: () => ipcRenderer.invoke('get-partners'),
});