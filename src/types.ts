import { Dirent } from 'fs';

export interface ISourceOutputFoldersContent {
  sourceDirFiles: Record<string, Dirent>;
  outputDirFiles: Record<string, Dirent>;
}

export interface IIconProps {
  className?: React.SVGProps<SVGSVGElement>['className'];
}

export interface FileEntry {
  name: string;
  path: string;
  parentPath: string;
  isDirectory: boolean;
  isFile: boolean;
  isSymbolicLink: boolean;
}

export interface LinkedFolder {
  dirKey: string;
  sourceDirName: string;
  sourceDirPath: string;
  outputDirName: string;
  outputDirPath: string;
  filesSynced: string[];
  filesInOutputNoLongerSymLinks: string[];
  filesMissingFromSource: string[];
  filesMissingFromOutput: string[];
  filesMissingFromBoth: string[];
  allFolderItemsSynced: boolean;
  timeSynced: number;
}

export interface ISymLinkedSettingsFolder {
  sourceDir: string;
  outputDir: string;
  allFolderItemsSynced: boolean;
  fileNames: string[];
  lastSyncedTime: number;
}
export interface ISymLinkSettings {
  linkedFiles: Record<string, ISymLinkedSettingsFolder>;
}
