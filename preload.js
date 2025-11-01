const { contextBridge, ipcRenderer } = require('electron')
const params = new URLSearchParams(window.location.search)
const idxRaw = params.get('displayIndex')
const idxNum = Number.isFinite(Number(idxRaw)) ? Number(idxRaw) : null
contextBridge.exposeInMainWorld('displayInfo', {
  index0: idxRaw,
  number: idxNum !== null ? idxNum + 1 : 'N/A',
  id: params.get('displayId')
})

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }

  const displayEl = document.getElementById('display-number')
  if (displayEl && window.displayInfo) {
    displayEl.innerText = `Display ${window.displayInfo.number} (id: ${window.displayInfo.id})`
  }

  ipcRenderer.on('display-info', (_event, payload) => {
    if (displayEl && payload) {
      displayEl.innerText = `Display ${payload.number} (id: ${payload.id})`
    }
  })
})
