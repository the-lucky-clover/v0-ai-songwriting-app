const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const OpenAI = require('openai');

const isDev = process.env.NODE_ENV === 'development';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, 'out/index.html'));
  }
}

ipcMain.handle('scrape', async (event, url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    return $('body').text().slice(0, 1000); // return first 1000 chars
  } catch (error) {
    return 'Error scraping: ' + error.message;
  }
});

ipcMain.handle('aiResearch', async (event, query) => {
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: query }],
    });
    return response.choices[0].message.content;
  } catch (error) {
    return 'Error in AI research: ' + error.message;
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});