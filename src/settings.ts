import { DirEntry, readDir } from '@tauri-apps/plugin-fs';
import { load } from '@tauri-apps/plugin-store';
import { LinkedFolder } from './types';
import { arrayToObject, removeFilesToIgnore } from './utils';

const settings = await load('settings.json', { autoSave: false });

interface SavedLinkedFileJSON {
  sourceDir: string;
  outputDir: string;
  allFolderItemsSynced: boolean;
  fileNames: string[];
  lastSyncedTime: number;
}

const getLinkedFilesSettingsKey = (sourceDir: string, outputDir: string) => [sourceDir, outputDir].join(':');

const createLinkedFilesSettingsObj = ({ sourceDir, outputDir, allFolderItemsSynced, filesToLink }: Pick<LinkedFolder, 'sourceDir' | 'outputDir' | 'allFolderItemsSynced'> & { filesToLink: DirEntry[] }) => {
  const linkedFileObj: SavedLinkedFileJSON = {
    sourceDir,
    outputDir,
    allFolderItemsSynced,
    fileNames: filesToLink.map(fileEntry => fileEntry.name),
    lastSyncedTime: Date.now(),
  };
  return { linkKey: getLinkedFilesSettingsKey(sourceDir, outputDir), linkValue: JSON.stringify(linkedFileObj) };
};

const saveLinkInfoToSettings = async ({
  sourceDir,
  outputDir,
  filesToLink,
  allFolderItemsSynced,
}: {
  sourceDir: string;
  outputDir: string;
  filesToLink: DirEntry[];
  allFolderItemsSynced: LinkedFolder['allFolderItemsSynced'];
}) => {
  const { linkKey, linkValue } = createLinkedFilesSettingsObj({ sourceDir, outputDir, allFolderItemsSynced, filesToLink });
  const linkedFiles = (await settings.get('linkedFiles')) as { [n: string]: string[] };
  settings.set('linkedFiles', { ...linkedFiles, [linkKey]: linkValue });
  settings.save();
};

const getLinkedFolderFromSettings: (linkKey: string, linkValue?: string) => Promise<LinkedFolder | string> = async (linkKey, linkValue) => {
  let retrievedSavedfile: SavedLinkedFileJSON | null = null;
  if (!linkValue) {
    const linkedFiles = (await settings.get('linkedFiles')) as { [n: string]: string };
    linkValue = linkedFiles[linkKey];
  }

  try {
    retrievedSavedfile = JSON.parse(linkValue);
  } catch (error) {
    console.error('Error parsing linked file from settings:', error);
  }

  if (!retrievedSavedfile) return linkKey;

  const sourceDirFiles = readDir(retrievedSavedfile.sourceDir);
  const outputDirFiles = readDir(retrievedSavedfile.outputDir);

  const [sourceFiles, outputFiles] = await Promise.all([sourceDirFiles, outputDirFiles]).then(([sourceFiles, outputFiles]) => [
    arrayToObject(removeFilesToIgnore(sourceFiles), 'name'),
    arrayToObject(removeFilesToIgnore(outputFiles), 'name'),
  ]);

  const filesSynced: string[] = [];
  const filesInOutputNoLongerSymLinks: string[] = [];
  const filesMissingFromSource: string[] = [];
  const filesMissingFromOutput: string[] = [];
  const filesMissingFromBoth: string[] = [];

  for (const fileName of retrievedSavedfile.fileNames) {
    const sourceFile = sourceFiles[fileName];
    const outputFile = outputFiles[fileName];

    if (sourceFile && outputFile) {
      if (outputFile.isSymlink) {
        filesSynced.push(fileName);
      } else {
        filesInOutputNoLongerSymLinks.push(fileName);
      }
    } else if (!sourceFile && !outputFile) {
      filesMissingFromBoth.push(fileName);
    } else if (sourceFile) {
      filesMissingFromOutput.push(fileName);
    } else if (outputFile) {
      filesMissingFromSource.push(fileName);
    }
  }

  const linkedFolder: LinkedFolder = {
    dirKey: linkKey,
    sourceDir: retrievedSavedfile.sourceDir,
    outputDir: retrievedSavedfile.outputDir,
    allFolderItemsSynced: retrievedSavedfile.allFolderItemsSynced,
    timeSynced: retrievedSavedfile.lastSyncedTime,
    filesSynced,
    filesInOutputNoLongerSymLinks,
    filesMissingFromSource,
    filesMissingFromOutput,
    filesMissingFromBoth,
  };

  return linkedFolder;
};

const getAllLinkedFoldersFromSettings = async () => {
  const linkedFiles = (await settings.get('linkedFiles')) as { [n: string]: string };
  if (!linkedFiles) return null;

  const linkedFolders = Object.entries(linkedFiles).map(([linkKey, linkValue]) => getLinkedFolderFromSettings(linkKey, linkValue));
  return Promise.all(linkedFolders);
};

export { getAllLinkedFoldersFromSettings, saveLinkInfoToSettings, settings };
