
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Storage API
  storage: {
    setItem: (key, value) => ipcRenderer.invoke('storage:setItem', key, value),
    getItem: (key) => ipcRenderer.invoke('storage:getItem', key),
    removeItem: (key) => ipcRenderer.invoke('storage:removeItem', key)
  }
});
