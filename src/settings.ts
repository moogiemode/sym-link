import { ISymLinkedSettingsFolder, LinkedFolder } from './types';
import { arrayToObject, removeFilesToIgnore } from './utils';

// const settings = await load('settings.json', { autoSave: false });

const delimiter = '::';

export const getLinkedFilesSettingsKey = (sourceDir: string, outputDir: string) => [sourceDir, outputDir].join(delimiter);

export const getLinkedFolderStats: (symLinkedSetting: ISymLinkedSettingsFolder) => Promise<LinkedFolder> = async symLinkedSetting => {
  const sourceDirFiles = window.electronAPI.readDirectory(symLinkedSetting.sourceDir);
  const outputDirFiles = window.electronAPI.readDirectory(symLinkedSetting.outputDir);

  const [sourceFiles, outputFiles] = await Promise.all([sourceDirFiles, outputDirFiles]).then(([sourceFiles, outputFiles]) => [
    arrayToObject(removeFilesToIgnore(sourceFiles), 'name'),
    arrayToObject(removeFilesToIgnore(outputFiles), 'name'),
  ]);

  const filesSynced: string[] = [];
  const filesInOutputNoLongerSymLinks: string[] = [];
  const filesMissingFromSource: string[] = [];
  const filesMissingFromOutput: string[] = [];
  const filesMissingFromBoth: string[] = [];
  const filesInSourceNotSynced: string[] = [];
  const sourceFolderFiles = Object.values(sourceFiles);
  const outputFolderFiles = Object.values(outputFiles);

  for (const fileName of symLinkedSetting.fileNames) {
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
    delete sourceFiles[fileName];
  }

  for (const fileName in sourceFiles) {
    filesInSourceNotSynced.push(fileName);
  }

  const [sourceDirName, outputDirName] = await Promise.all([symLinkedSetting.sourceDir, symLinkedSetting.outputDir].map(async path => await window.electronAPI.pathBasename(path)));

  const linkedFolder: LinkedFolder = {
    dirKey: getLinkedFilesSettingsKey(symLinkedSetting.sourceDir, symLinkedSetting.outputDir),
    linkedFiles: symLinkedSetting.fileNames,
    sourceDirName,
    outputDirName,
    sourceDirPath: symLinkedSetting.sourceDir,
    outputDirPath: symLinkedSetting.outputDir,
    sourceFolderFiles,
    outputFolderFiles,
    allFolderItemsSynced: symLinkedSetting.allFolderItemsSynced,
    timeSynced: symLinkedSetting.lastSyncedTime,
    filesSynced,
    filesInOutputNoLongerSymLinks,
    filesMissingFromSource,
    filesMissingFromOutput,
    filesMissingFromBoth,
    filesInSourceNotSynced,
  };

  return linkedFolder;
};

const getAllLinkedFoldersFromSettings = async () => {
  const linkedFiles = await window.electronAPI.getSettings('linkedFiles');
  if (!linkedFiles) return null;

  const linkedFolders = Object.values(linkedFiles).map(symLinkedSetting => getLinkedFolderStats(symLinkedSetting));
  return Promise.all(linkedFolders);
};

export { getAllLinkedFoldersFromSettings };
