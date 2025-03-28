
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const url = require('url');

// Create the storage directory if it doesn't exist
const storageDir = path.join(app.getPath('userData'), 'Storage-Confidential');
const subDirectories = ['orders', 'menu', 'branches', 'settings', 'receipts', 'ratings', 'inventory'];

function createStorageDirectories() {
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir);
    console.log(`Created main storage directory: ${storageDir}`);
  }

  // Create subdirectories
  subDirectories.forEach(dir => {
    const subDir = path.join(storageDir, dir);
    if (!fs.existsSync(subDir)) {
      fs.mkdirSync(subDir);
      console.log(`Created subdirectory: ${subDir}`);
    }
  });
}

// Create main window
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#f1f5f9' // Light background color
  });

  // Load the app
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../dist/index.html'),
    protocol: 'file:',
    slashes: true
  });
  
  mainWindow.loadURL(startUrl);
  
  // Show window when ready to avoid flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  
  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

// IPC handlers for storage operations
function setupIpcHandlers() {
  // Save data to File
  ipcMain.handle('storage:setItem', async (event, key, value) => {
    try {
      const filePath = path.join(storageDir, key.replace(/\//g, path.sep));
      const dirPath = path.dirname(filePath);
      
      // Ensure directory exists
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      // Write file
      fs.writeFileSync(filePath, value);
      console.log(`Data saved to ${filePath}`);
      return true;
    } catch (error) {
      console.error(`Failed to save data to ${key}:`, error);
      return false;
    }
  });

  // Get data from file
  ipcMain.handle('storage:getItem', async (event, key) => {
    try {
      const filePath = path.join(storageDir, key.replace(/\//g, path.sep));
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return data;
      }
      return null;
    } catch (error) {
      console.error(`Failed to retrieve data from ${key}:`, error);
      return null;
    }
  });

  // Remove data file
  ipcMain.handle('storage:removeItem', async (event, key) => {
    try {
      const filePath = path.join(storageDir, key.replace(/\//g, path.sep));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Removed file: ${filePath}`);
      }
      return true;
    } catch (error) {
      console.error(`Failed to remove data at ${key}:`, error);
      return false;
    }
  });
}

// App lifecycle
app.whenReady().then(() => {
  createStorageDirectories();
  setupIpcHandlers();
  createWindow();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
