import { access, mkdir, readFile, writeFile, unlink, rm, lstat } from 'fs/promises';
import { app } from 'electron';

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

export async function ipcGetLinkInfo(_: Electron.IpcMainInvokeEvent, linkKey: string) {
  const linkedSettings = (await ipcGetSettings(null, 'linkedFiles')) || {};
  return linkedSettings[linkKey];
}

export async function ipcDeleteLinkInfo(_: Electron.IpcMainInvokeEvent, linkKey: string, linkFileNames?: string[]) {
  /*
    delete all links in this file that are tied to the key while not deleting some that may have come from other sources
  */
  const linkedFolderInfo = await ipcGetLinkInfo(null, linkKey);
  const fileNamesSet = linkFileNames ? new Set(linkedFolderInfo.fileNames) : null; // creating a set here because if file names have been passed we need to do selective deletion

  const unlinkFile = async (fileName: string) => {
    const fileStats = await lstat(path.join(linkedFolderInfo.outputDir, fileName));
    if (fileStats.isDirectory()) {
      return await rm(path.join(linkedFolderInfo.outputDir, fileName));
    } else if (fileStats.isSymbolicLink()) {
      return await unlink(path.join(linkedFolderInfo.outputDir, fileName));
    }
    if (fileNamesSet && fileNamesSet.has(fileName)) {
      fileNamesSet.delete(fileName);
    }
  };

  const linkedFilesToDelete = (linkFileNames || linkedFolderInfo.fileNames).map(unlinkFile);

  await Promise.all(linkedFilesToDelete).then(async () => {
    if (fileNamesSet) {
      linkedFolderInfo.fileNames = Array.from(fileNamesSet);
      await ipcSaveLinkInfo(null, linkKey, linkedFolderInfo);
    } else {
      const linkedSettings = (await ipcGetSettings(null, 'linkedFiles')) || {};
      delete linkedSettings[linkKey];
      await ipcSaveSettings(null, 'linkedFiles', linkedSettings);
    }
  });
}
