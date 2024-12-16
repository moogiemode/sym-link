import { join } from '@tauri-apps/api/path';
import { DirEntry } from '@tauri-apps/plugin-fs';
import { family } from '@tauri-apps/plugin-os';
import { ChildProcess, Command } from '@tauri-apps/plugin-shell';

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

  await Promise.all(commands);
};
