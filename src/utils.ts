import { getLinkedFilesSettingsKey, getLinkedFolderFromSettings } from './settings';
import { Dirent } from 'fs';
import { useSymLinkStore } from './store';

const pathJoin = window.electronAPI.pathJoin;
const pathResolve = window.electronAPI.pathResolve;
const pathDirname = window.electronAPI.pathDirname;

export function arrayToObject<T>(array: T[], key: keyof T): Record<string, T> {
  return array.reduce(
    (acc, item) => {
      const keyValue = String(item[key]);
      acc[keyValue] = item;
      return acc;
    },
    {} as Record<string, T>,
  );
}

export const filesToIgnore = new Set<string>(['.DS_Store']);

export const checkLinkTarget: (symlinkPath: string, originPath: string) => Promise<boolean> = async (symlinkPath, originFilePath) => {
  try {
    const resolvedTargetPath = await pathResolve(await pathDirname(symlinkPath), await window.electronAPI.readLink(symlinkPath));

    return resolvedTargetPath === (await pathResolve(originFilePath));
  } catch (err) {
    console.error(`Error checking symlink: ${err}`);
    return false;
  }
};

export function removeFilesToIgnore<T extends string | Dirent>(files: T[]): T[] {
  return files.filter(file => {
    if (typeof file === 'string') {
      return !filesToIgnore.has(file);
    } else {
      return !filesToIgnore.has(file.name);
    }
  });
}

export const dirExists = async (dirPath: string) => {
  try {
    return await window.electronAPI.ensureDirectory(dirPath);
  } catch {
    return false;
  }
};

// POTENTIAL FOR OPTIMIZATION AS LARGE NUMBER OF FILES MAY REACH THE LIMIT. SUGGESTION - USE BATCHES OF 100 FILES
export const createSymLinks = async ({ sourceDir, outputDir, filesToLink, allFolderItemsSynced }: { sourceDir: string; outputDir: string; filesToLink: Dirent[]; allFolderItemsSynced: boolean }) => {
  const fileNames: string[] = [];

  await Promise.all(
    filesToLink.map(async file => {
      fileNames.push(file.name); // Add file name to list of files to link

      return window.electronAPI.symLink(await pathJoin(sourceDir, file.name), await pathJoin(outputDir, file.name));
    }),
  )
    .then(async () => await window.electronAPI.saveLinkInfo(getLinkedFilesSettingsKey(sourceDir, outputDir), { sourceDir, outputDir, fileNames, allFolderItemsSynced, lastSyncedTime: Date.now() }))
    .then(async linkValue => useSymLinkStore.getState().setLinkedFile(await getLinkedFolderFromSettings(linkValue)))
    .catch(err => console.error(`Error creating symlink: ${err}`));
};

export const deleteSymLinks = async ({ sourceDir, outputDir, linkFileNames }: { sourceDir: string; outputDir: string; linkFileNames?: string[] }) => {
  const settingsKey = getLinkedFilesSettingsKey(sourceDir, outputDir);
  window.electronAPI.deleteLinkInfo(settingsKey, linkFileNames).then(async res => {
    if (typeof res === 'string') {
      useSymLinkStore.getState().deleteLinkedFile(res);
    } else {
      useSymLinkStore.getState().setLinkedFile(await getLinkedFolderFromSettings(res));
    }
  });
};
