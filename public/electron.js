const { app, BrowserWindow, ipcMain, Tray, Menu, screen, Notification } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;
let tray;

const PROTOCOL = 'neurofocus';

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient(PROTOCOL);
}

function createWindow() {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

  const windowWidth = 380;
  const windowHeight = 600;

  const xPosition = screenWidth - windowWidth - 20;
  const yPosition = screenHeight - windowHeight - 20;

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: xPosition,
    y: yPosition,
    minWidth: 350,
    minHeight: 500,
    maxWidth: 450,
    frame: true,
    alwaysOnTop: false,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    backgroundColor: '#1a1a2e',
    title: 'NeuroFocus',
    icon: path.join(__dirname, 'icon.png')
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // ⭐️ JEDYNA ZMIANA JAKĄ MUSIAŁAŚ MIEĆ ⭐️
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.executeJavaScript(`window.IS_ELECTRON = true;`);
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();

      if (Notification.isSupported()) {
        new Notification({
          title: 'NeuroFocus',
          body: 'Aplikacja działa w tle. Kliknij ikonę w zasobniku, aby przywrócić.',
          icon: path.join(__dirname, 'icon.png')
        }).show();
      }
    }
    return false;
  });

  mainWindow.on('minimize', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, 'icon.png'));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Pokaż aplikację',
      click: () => mainWindow.show()
    },
    {
      label: 'Pauza Pomodoro',
      click: () => mainWindow.webContents.send('toggle-pomodoro')
    },
    { type: 'separator' },
    {
      label: 'Wyjście',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('NeuroFocus - Kontrola koncentracji');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (mainWindow.isVisible()) mainWindow.hide();
    else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  tray.on('double-click', () => {
    if (mainWindow.isVisible()) mainWindow.hide();
    else {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

ipcMain.on('notification', (event, data) => {
  if (Notification.isSupported()) {
    new Notification({
      title: data.title,
      body: data.body,
      icon: path.join(__dirname, 'icon.png')
    }).show();
  }
});

ipcMain.on('show-window', (event, data) => {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
    mainWindow.flashFrame(true);

    if (Notification.isSupported()) {
      new Notification({
        title: data.title || 'NeuroFocus',
        body: data.body || 'Timer zakończony!',
        icon: path.join(__dirname, 'icon.png')
      }).show();
    }
  }
});

ipcMain.on('update-tray-title', (event, title) => {
  if (tray) {
    tray.setTitle(title);
  }
});

app.on('open-url', (event, url) => {
  event.preventDefault();

  if (url.startsWith(`${PROTOCOL}://`)) {
    if (mainWindow) {
      mainWindow.webContents.send('spotify-callback', url);
      mainWindow.show();
      mainWindow.focus();
    }
  }
});

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine) => {
    const url = commandLine.find(arg => arg.startsWith(`${PROTOCOL}://`));

    if (url) {
      if (mainWindow) {
        mainWindow.webContents.send('spotify-callback', url);

        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.show();
        mainWindow.focus();
      }
    } else {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  app.isQuitting = true;
});
