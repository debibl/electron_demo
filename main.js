const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const { Client } = require('pg');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'src/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  })

  win.loadFile('./src/index.html')
}

// Работаем с базой данных
async function getPartners() {
  const client = new Client({
    user: 'electron',
    password: '123test',
    host: 'localhost',
    port: 5433,
    database: 'electron',
  });

  await client.connect();
  const res = await client.query('SELECT * FROM partners;');
  await client.end();

  return res.rows;
}

app.whenReady().then(() => {
  // Oбрабатываем запрос
  ipcMain.handle('get-partners', async () => {
    return await getPartners();
  });

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})