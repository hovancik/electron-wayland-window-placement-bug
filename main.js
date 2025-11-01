const { app, BrowserWindow, screen } = require('electron')
const path = require('node:path')
let displayWindows = []
function createWindowsForDisplays() {
  const displays = screen.getAllDisplays()
  displayWindows = []

  displays.forEach((display, index) => {
  const { x, y, width, height } = display.workArea

    const win = new BrowserWindow({
      x,
      y,
      width,
      height,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })

    win.loadFile('index.html', { query: { displayIndex: String(index), displayId: String(display.id) } })

    win.webContents.on('did-finish-load', () => {
      win.webContents.send('display-info', {
        index0: index,
        number: index + 1,
        id: display.id
      })
    })

    win.once('ready-to-show', () => {
      win.show()
    })


    displayWindows.push(win)
  })
}

function ensureDisplayWindows() {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindowsForDisplays()
  }
}

app.whenReady().then(() => {
  createWindowsForDisplays()

  app.on('activate', () => {
    ensureDisplayWindows()
  })

  screen.on('display-added', () => {
    createWindowsForDisplays()
  })
  screen.on('display-removed', () => {
    BrowserWindow.getAllWindows().forEach(w => w.close())
    createWindowsForDisplays()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
