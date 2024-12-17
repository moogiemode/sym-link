import { join } from '@tauri-apps/api/path';
import { DirEntry } from '@tauri-apps/plugin-fs';
import { family } from '@tauri-apps/plugin-os';
import { ChildProcess, Command } from '@tauri-apps/plugin-shell';
import { saveLinkInfoToSettings } from './settings';

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

// POTENTIAL FOR OPTIMIZATION AS LARGE NUMBER OF FILES MAY REACH THE LIMIT. SUGGESTION - USE BATCHES OF 100 FILES
export const createSymLinks = async (sourceDir: string, outputDir: string, filesToLink: DirEntry[]) => {
  const osFamily = family();

  const commands: Promise<ChildProcess<string>>[] = [];

  for (const file of filesToLink) {
    if (osFamily === 'unix') {
      commands.push(Command.create('exec-sh', ['-c', `ln -s "${await join(sourceDir, file.name)}" "${await join(outputDir, file.name)}"`]).execute());
    } else if (osFamily === 'windows') {
      commands.push(Command.create('exec-cmd', ['/c', `mklink${file.isDirectory ? ' /D' : ''} "${await join(outputDir, file.name)}" "${await join(sourceDir, file.name)}"`]).execute());
    }
  }

  await Promise.all(commands).then(() => saveLinkInfoToSettings(sourceDir, outputDir, filesToLink));
};

export const filesToIgnore: Set<string> = new Set(['.DS_Store']);

const stringToColor = (string: string) => {
  let hash = 0;

  for (let i = 0; i < string.length; i++) hash = string.charCodeAt(i) + ((hash << 5) - hash); // DJB2 hash algorithm

  let color = '#';

  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;

    color += ('00' + value.toString(16)).substr(-2);
  }

  return color;
};
