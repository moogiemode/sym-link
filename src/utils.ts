import { join } from '@tauri-apps/api/path';
import { readDir } from '@tauri-apps/plugin-fs';
import { family } from '@tauri-apps/plugin-os';
import { Command } from '@tauri-apps/plugin-shell';

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


export const createSymLink = async (sourceDir: string, outputDir: string) => {
  const osFamily = family();
  const cmd = osFamily === 'windows' ? 'symlink-windows' : 'symlink-unix';

  const sourceDirItems = await readDir(sourceDir);
  // const result = await Command.create('exec-sh', ['-c', "echo 'Hello World!'"]).execute();
  // console.log(result);

  for (const dirItem of sourceDirItems) {
    // const argsArr = [await join(sourceDir, dirItem.name), await join(outputDir, dirItem.name)];

    // if (dirItem.isDirectory || osFamily === 'unix') argsArr.unshift(osFamily === 'unix' ? '-s' : '/D');
    if (osFamily === 'unix') {
      await Command.create('exec-sh', ['-c', `ln -s "${await join(sourceDir, dirItem.name)}" "${await join(outputDir, dirItem.name)}"`]).execute();
    } else if (osFamily === 'windows') {
      await Command.create('exec-cmd', ['/c', `mklink${dirItem.isDirectory ? ' /D' : ''} "${await join(outputDir, dirItem.name)}" "${await join(sourceDir, dirItem.name)}"`]).execute();
    }
  }
};
