const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('fido2', {
    hmacCreateSecret: () => ipcRenderer.invoke('hmacCreateSecret'),
    hmacGetSecret: () => ipcRenderer.invoke('hmacGetSecret'),
})

