import { join } from '@tauri-apps/api/path';
import { DirEntry, FileInfo, stat } from '@tauri-apps/plugin-fs';
import { load } from '@tauri-apps/plugin-store';

const settings = await load('settings.json', { autoSave: false });

const saveLinkInfoToSettings = async (sourceDir: string, outputDir: string, filesToLink: DirEntry[]) => {
  const newLinkedFilesEntry = { [[sourceDir, outputDir].join(':')]: filesToLink.map(f => f.name) };
  const linkedFiles = (await settings.get('linkedFiles')) as { [n: string]: string[] };
  settings.set('linkedFiles', { ...linkedFiles, ...newLinkedFilesEntry });
  settings.save();
};

interface SavedLinkedFiles {
  key: string;
  sourceDir: string;
  outputDir: string;
  files: FileInfo[];
}

const getSavedLinkedFiles = async () => {
  const savedFilesFromSettings = (await settings.get('linkedFiles')) as { [n: string]: string[] };
  if (!savedFilesFromSettings) return;

  const savedFilesPromise: Promise<SavedLinkedFiles>[] = Object.entries(savedFilesFromSettings).map(([key, value]) => buildFromKeyValue(key, value));

  const savedFiles = await Promise.all(savedFilesPromise);
  console.log(savedFiles);
};

const buildFromKeyValue: (key: string, value: string[]) => Promise<SavedLinkedFiles> = async (key, value) => {
  const [sourceDir, outputDir] = key.split(':');

  const files: FileInfo[] = await Promise.all(value.map(async fileName => await stat(await join(sourceDir, fileName))));

  return { key, sourceDir, outputDir, files };
};

export { getSavedLinkedFiles, saveLinkInfoToSettings, settings };
