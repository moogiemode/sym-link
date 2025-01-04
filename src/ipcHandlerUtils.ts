import { access, mkdir, readdir, readFile, readlink, symlink, writeFile } from 'fs/promises';
import { app, BrowserWindow, dialog, ipcMain } from 'electron';

import { ISymLinkedSettingsFolder, ISymLinkSettings } from './types';
import path from 'path';
import { symLinkAppDataFolderName, symLinkSettingsFileName } from './main';

export const ipcEnsureDirectory: (dirPath: string, allowCreate?: boolean) => Promise<boolean> = async (dirPath: string, allowCreate?: boolean) => {
  try {
    await access(dirPath);
    return true;
  } catch {
    // Directory doesn't exist, create it
    if (allowCreate) {
      return await mkdir(dirPath, { recursive: true })
        .then(() => true)
        .catch(() => false);
    } else {
      return false;
    }
  }
};

export async function ipcSaveSettings<K extends keyof ISymLinkSettings>(_: Electron.IpcMainInvokeEvent, key: K, value: ISymLinkSettings[K]) {
  const settingsPath = path.join(app.getPath('appData'), symLinkAppDataFolderName, symLinkSettingsFileName);
  await ipcEnsureDirectory(path.dirname(settingsPath), true);
  const settingsObj: ISymLinkSettings = JSON.parse(await readFile(settingsPath, 'utf-8')) || {};
  settingsObj[key] = value;
  await writeFile(settingsPath, JSON.stringify(settingsObj, null, 2));
}

export async function ipcGetSettings<K extends keyof ISymLinkSettings>(_: Electron.IpcMainInvokeEvent, key: K) {
  try {
    const settings: ISymLinkSettings = JSON.parse(await readFile(path.join(app.getPath('appData'), symLinkAppDataFolderName, symLinkSettingsFileName), 'utf-8'));
    return settings[key];
  } catch {
    return null;
  }
}

export async function ipcSaveLinkInfo(_: Electron.IpcMainInvokeEvent, linkKey: string, linkValue: ISymLinkedSettingsFolder) {
  const linkedSettings = (await ipcGetSettings(null, 'linkedFiles')) || {};
  linkedSettings[linkKey] = linkValue;
  await ipcSaveSettings(null, 'linkedFiles', linkedSettings);
}

export async function ipcDeleteLinkInfo(_: Electron.IpcMainInvokeEvent, linkKey: string) {
  const linkedSettings = (await ipcGetSettings(null, 'linkedFiles')) || {};
  delete linkedSettings[linkKey];
  await ipcSaveSettings(null, 'linkedFiles', linkedSettings);
}
