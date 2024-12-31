// import { join } from '@tauri-apps/api/path';
// import { DirEntry } from '@tauri-apps/plugin-fs';
// import { family } from '@tauri-apps/plugin-os';
// import { ChildProcess, Command } from '@tauri-apps/plugin-shell';
// import { saveLinkInfoToSettings } from './settings';
import { Dirent } from 'fs';
import path from 'path';

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
    const resolvedTargetPath = path.resolve(path.dirname(symlinkPath), await window.electronAPI.readLink(symlinkPath));

    return resolvedTargetPath === path.resolve(originFilePath);
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
}

// POTENTIAL FOR OPTIMIZATION AS LARGE NUMBER OF FILES MAY REACH THE LIMIT. SUGGESTION - USE BATCHES OF 100 FILES
export const createSymLinks = async ({ sourceDir, outputDir, filesToLink, allFolderItemsSynced }: { sourceDir: string; outputDir: string; filesToLink: Dirent[]; allFolderItemsSynced: boolean }) => {
  await Promise.all(filesToLink.map(async file => window.electronAPI.symLink(path.join(sourceDir, file.name), path.join(outputDir, file.name))));
  // .then(() =>saveLinkInfoToSettings({ sourceDir, outputDir, filesToLink, allFolderItemsSynced }));
};
