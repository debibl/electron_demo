const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getPartners: () => ipcRenderer.invoke('get-partners'),
  createPartner: (partner) => ipcRenderer.invoke('create-partner', partner),
  updatePartner: (partner) => ipcRenderer.invoke('update-partner', partner),
  getPartnerById: (pID) => ipcRenderer.invoke('get-by-id', pID)
})
