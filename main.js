// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { FIDO2Client, FIDO2Crypto, PreloadPath } = require('@vincss-public-projects/fido2-client')


function arrBuffToHex(buffer) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)))
}
function createWindow() {
  // Create the browser window.
  let fido2 = new FIDO2Client();
  let win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // win.loadURL('https://webauthn.cybersecvn.com').then(() => {
  //   // win.webContents.openDevTools();
  // });

  let id;
  const salt1 = FIDO2Crypto.random(32)
  // ipcMain.handle('navigator.credentials.create', (event, options) => fido2.makeCredential(event.sender.getURL(), options));
  // ipcMain.handle('navigator.credentials.get', (event, options) => fido2.getAssertion(event.sender.getURL(), options));
  ipcMain.handle('hmacCreateSecret', async () => {
    const cred = await fido2.makeCredential('https://vincss.net', {
      publicKey: {
        rp: {
          name: 'vincss',
          id: 'vincss.net'
        },
        challenge: FIDO2Crypto.random(32),
        user: {
          name: 'test',
          displayName: 'Test',
          id: FIDO2Crypto.random(32),
          icon: 'icon'
        },
        pubKeyCredParams: [
          {
            alg: -7,
            type: 'public-key'
          }, {
            type: "public-key",
            alg: -257
          }
        ],
        extensions: {
          hmacCreateSecret: true
        },
        authenticatorSelection: {
          userVerification: "required"
        },
        timeout: 100000
      }
    })
    id = cred.rawId
    console.log(arrBuffToHex(cred.rawId))
    console.log(arrBuffToHex(salt1))
    return {
      rawId: arrBuffToHex(cred.rawId),
      salt1: arrBuffToHex(salt1)
    }
  })
  ipcMain.handle('hmacGetSecret', async () => {
    const cred = await fido2.getAssertion('https://vincss.net', {
      publicKey: {
        rpId: 'vincss.net',
        challenge: FIDO2Crypto.random(32),
        allowCredentials: [
          {
            id: id,
            type: 'public-key'
          }
        ],
        extensions: {
          hmacGetSecret: {
            salt1: salt1
          }
        },
        userVerification: 'required'
      }
    })
    const arrBuff = cred.clientExtensionResults.hmacGetSecret['output1']
    console.log(arrBuffToHex(arrBuff))
    return arrBuffToHex(arrBuff)
  })

  // Open the DevTools.
  win.loadFile('index.html')
  win.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()


  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})




// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
