import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'path';
import { readdir, readFile, readlink, symlink, writeFile } from 'fs/promises';
import started from 'electron-squirrel-startup';
import { FileEntry, ISymLinkSettings } from './types';
import { ipcDeleteLinkInfo, ipcEnsureDirectory, ipcGetLinkInfo, ipcGetSettings, ipcSaveLinkInfo, ipcSaveSettings } from './ipcHandlerUtils';

export const symLinkAppDataFolderName = 'SymLink';
export const symLinkSettingsFileName = 'settings.json';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.setTitle(title);
  });

  ipcMain.handle('path-join', async (_, ...pathArgs: string[]) => path.join(...pathArgs));
  ipcMain.handle('path-resolve', async (_, ...pathArgs: string[]) => path.resolve(...pathArgs));
  ipcMain.handle('path-dirname', async (_, pathArg: string) => path.dirname(pathArg));
  ipcMain.handle('path-basename', async (_, pathArg: string) => path.basename(pathArg));

  ipcMain.handle('open-dialog', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory'], //only directories can be selected
    });

    if (!canceled) {
      return filePaths[0];
    }
  });

  ipcMain.handle('read-directory', async (_, dirPath: string) => {
    const dirFiles = await readdir(dirPath, { withFileTypes: true });

    const fileEntries: FileEntry[] = dirFiles.map(dirent => ({
      name: dirent.name,
      path: path.join(dirPath, dirent.name),
      parentPath: dirPath,
      isDirectory: dirent.isDirectory(),
      isFile: dirent.isFile(),
      isSymbolicLink: dirent.isSymbolicLink(),
    }));

    return fileEntries;
  });
  ipcMain.handle('read-link', async (_, linkPath: string) => await readlink(linkPath, 'utf-8'));

  ipcMain.handle('sym-link', async (_, sourcePath: string, linkPath: string) => await symlink(sourcePath, linkPath));
  ipcMain.handle('ensure-directory', async (_, dirPath: string, allowCreate?: boolean) => await ipcEnsureDirectory(dirPath, allowCreate));

  ipcMain.handle('save-settings', ipcSaveSettings);

  ipcMain.handle('get-settings', ipcGetSettings);

  ipcMain.handle('save-link-info', ipcSaveLinkInfo);

  ipcMain.handle('get-link-info', ipcGetLinkInfo);

  ipcMain.handle('delete-link-info', ipcDeleteLinkInfo);

  ipcMain.handle('clear-settings', async () => {
    const settingsPath = path.join(app.getPath('appData'), symLinkAppDataFolderName, symLinkSettingsFileName);
    await writeFile(settingsPath, '{}');
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
