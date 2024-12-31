// import { join } from '@tauri-apps/api/path';
// import { DirEntry } from '@tauri-apps/plugin-fs';
// import { family } from '@tauri-apps/plugin-os';
// import { ChildProcess, Command } from '@tauri-apps/plugin-shell';
// import { saveLinkInfoToSettings } from './settings';
import { Dirent } from 'fs';
import { access, mkdir, readlink } from 'fs/promises';
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

export const ensureDirectory: (dirPath: string) => Promise<void> = async dirPath => {
  try {
    await access(dirPath);
  } catch {
    // Directory doesn't exist, create it
    await mkdir(dirPath, { recursive: true });
  }
};

export const checkLinkTarget: (symlinkPath: string, originPath: string) => Promise<boolean> = async (symlinkPath, originFilePath) => {
  try {
    const resolvedTargetPath = path.resolve(path.dirname(symlinkPath), await readlink(symlinkPath));

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

// POTENTIAL FOR OPTIMIZATION AS LARGE NUMBER OF FILES MAY REACH THE LIMIT. SUGGESTION - USE BATCHES OF 100 FILES
export const createSymLinks = async ({ sourceDir, outputDir, filesToLink, allFolderItemsSynced }: { sourceDir: string; outputDir: string; filesToLink: Dirent[]; allFolderItemsSynced: boolean }) => {
  // const osFamily = family();

  // const commands: Promise<ChildProcess<string>>[] = [];

  // for (const file of filesToLink) {
  //   if (osFamily === 'unix') {
  //     commands.push(Command.create('exec-sh', ['-c', `ln -s "${await join(sourceDir, file.name)}" "${await join(outputDir, file.name)}"`]).execute());
  //   } else if (osFamily === 'windows') {
  //     commands.push(Command.create('exec-cmd', ['/c', `mklink${file.isDirectory ? ' /D' : ''} "${await join(outputDir, file.name)}" "${await join(sourceDir, file.name)}"`]).execute());
  //   }
  // }

  // await Promise.all(commands).then(() => saveLinkInfoToSettings({ sourceDir, outputDir, filesToLink, allFolderItemsSynced }));
};
