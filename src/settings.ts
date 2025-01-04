import { ISymLinkedSettingsFolder, LinkedFolder } from './types';
import { arrayToObject, removeFilesToIgnore } from './utils';

// const settings = await load('settings.json', { autoSave: false });

const delimiter = '::';

export const getLinkedFilesSettingsKey = (sourceDir: string, outputDir: string) => [sourceDir, outputDir].join(delimiter);

const getLinkedFolderFromSettings: (linkKey: string, linkValue: ISymLinkedSettingsFolder) => Promise<LinkedFolder | string> = async (linkKey, linkValue) => {
  const sourceDirFiles = window.electronAPI.readDirectory(linkValue.sourceDir);
  const outputDirFiles = window.electronAPI.readDirectory(linkValue.outputDir);

  const [sourceFiles, outputFiles] = await Promise.all([sourceDirFiles, outputDirFiles]).then(([sourceFiles, outputFiles]) => [
    arrayToObject(removeFilesToIgnore(sourceFiles), 'name'),
    arrayToObject(removeFilesToIgnore(outputFiles), 'name'),
  ]);

  const filesSynced: string[] = [];
  const filesInOutputNoLongerSymLinks: string[] = [];
  const filesMissingFromSource: string[] = [];
  const filesMissingFromOutput: string[] = [];
  const filesMissingFromBoth: string[] = [];

  for (const fileName of linkValue.fileNames) {
    const sourceFile = sourceFiles[fileName];
    const outputFile = outputFiles[fileName];

    if (sourceFile && outputFile) {
      if (outputFile.isSymbolicLink) {
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

  const [sourceDirName, outputDirName] = await Promise.all([linkValue.sourceDir, linkValue.outputDir].map(async path => await window.electronAPI.pathBasename(path)));

  const linkedFolder: LinkedFolder = {
    dirKey: linkKey,
    linkedFiles: linkValue.fileNames,
    sourceDirName,
    outputDirName,
    sourceDirPath: linkValue.sourceDir,
    outputDirPath: linkValue.outputDir,
    allFolderItemsSynced: linkValue.allFolderItemsSynced,
    timeSynced: linkValue.lastSyncedTime,
    filesSynced,
    filesInOutputNoLongerSymLinks,
    filesMissingFromSource,
    filesMissingFromOutput,
    filesMissingFromBoth,
  };

  return linkedFolder;
};

const getAllLinkedFoldersFromSettings = async () => {
  const linkedFiles = await window.electronAPI.getSettings('linkedFiles');
  if (!linkedFiles) return null;

  const linkedFolders = Object.entries(linkedFiles).map(([linkKey, linkValue]) => getLinkedFolderFromSettings(linkKey, linkValue));
  return Promise.all(linkedFolders);
};

export { getAllLinkedFoldersFromSettings };
