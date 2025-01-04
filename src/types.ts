export interface ISourceOutputFoldersContent {
  sourceDirFiles: Record<string, FileEntry>;
  outputDirFiles: Record<string, FileEntry>;
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
  /**
   * The key for the linked folder, which is the source and output directory paths joined by a separator.
   * This is used to uniquely identify the linked folder.
   * @example
   * dirKey: '/Users/username/Documents/MySourceDir:/Users/username/Documents/MyOutputDir'
   */
  dirKey: string;
  /**
   * The names of the files in the linked folder.
   * @example
   * linkedFiles: ['file1.txt', 'file2.txt']
   */
  linkedFiles: string[];
  /**
   * The name of the source directory.
   * @example
   * sourceDirName: 'MySourceDir'
   */
  sourceDirName: string;
  /**
   * The path of the source directory.
   * @example
   * sourceDirPath: '/Users/username/Documents/MySourceDir'
   */
  sourceDirPath: string;
  /**
   * The name of the output directory.
   * @example
   * outputDirName: 'MyOutputDir'
   */
  outputDirName: string;
  /**
   * The path of the output directory.
   * @example
   * outputDirPath: '/Users/username/Documents/MyOutputDir'
   */
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
