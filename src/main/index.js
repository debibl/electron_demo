const { app, BrowserWindow, ipcMain, dialog } = require('electron/main')
const path = require('node:path')
const { Client } = require('pg')
const url = require('url')

app.setName('PartnersTable')

const mainWindow = () => {
  const win = new BrowserWindow({
    icon: path.join(__dirname, '../../resources/Мастер пол.ico'),
    // autoHideMenuBar: true,
    width: 700,
    height: 850,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // ❗ win.loadFile ВЫДАСТ ОШИБКУ
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, '../renderer/index.html'),
      protocol: 'file:',
      slashes: true
    })
  )
}

const login = {
  user: 'electron',
  password: '123test',
  host: 'localhost',
  port: 5433,
  database: 'electron'
}

//💾 Работаем с базой данных
async function getPartners() {
  const client = new Client(login)
  await client.connect()

  const res = await client.query('SELECT * FROM partners;')
  await client.end()

  return res.rows
}

async function createPartner(partner) {
  const client = new Client(login)
  await client.connect()

  const { type, name, ceo, email, phone, address, rating } = partner
  try {
    const check = await client.query(`SELECT * FROM partners WHERE name = $1;`, [name])
    if (check.rows.length > 0) {
      throw new Error('Партнёр с таким именем уже существует!')
    }
    await client.query(
      `INSERT INTO partners (organization_type, name, ceo, email, phone, address, rating) 
       VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [type, name, ceo, email, phone, address, Number(rating)]
    )
    dialog.showMessageBox({ message: '✅ Партнер создан!' })
  } catch (e) {
    console.log(e)
    dialog.showErrorBox('Ошибка', e.message || 'Ошибка при создании партнера!')
  }
}

async function updatePartner(partner) {
  const client = new Client(login)
  await client.connect()

  const { type, name, ceo, email, phone, address, rating, id } = partner
  try {
    await client.query(
      `UPDATE partners
      SET organization_type = $1, name = $2, ceo = $3, email = $4, phone = $5, address = $6, rating = $7
      WHERE partners.id = $8;`,
      [type, name, ceo, email, phone, address, Number(rating), id]
    )
    dialog.showMessageBox({ message: '✅ Информация обновлена!' })
  } catch (e) {
    console.log(e)
    if (e.code === '23505') {
      // Код ошибки для нарушения уникальности (unique_violation)
      dialog.showErrorBox('Ошибка', 'Партнёр с таким именем уже существует!')
    } else {
      dialog.showErrorBox('Ошибка', e.message || 'Ошибка при создании партнера!')
    }
  }
}

async function getPartnerById(pID) {
  const client = new Client(login)
  await client.connect()

  const res = await client.query(`SELECT * FROM partners WHERE id = $1;`, [pID])
  await client.end()

  return res.rows[0]
}

//♻️ Работа приложения
app.whenReady().then(() => {
  // Oбрабатываем запросы
  ipcMain.handle('get-partners', async () => {
    return await getPartners()
  })
  ipcMain.handle('create-partner', async (_, partner) => {
    return await createPartner(partner)
  })
  ipcMain.handle('update-partner', async (_, partner) => {
    return await updatePartner(partner)
  })
  ipcMain.handle('get-by-id', async (_, pID) => {
    return await getPartnerById(pID)
  })

  mainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
