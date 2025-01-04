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
  /**
   * The files in the source directory.
   * @example
   * sourceFolderFiles: [{ name: 'file1.txt', path: '/Users/username/Documents/MySourceDir/file1.txt', parentPath: '/Users/username/Documents/MySourceDir', isDirectory: false, isFile: true, isSymbolicLink: false }]
   * @type {FileEntry[]}
   */
  sourceFolderFiles: FileEntry[];
  /**
   * The files in the output directory.
   * @example
   * outputFolderFiles: [{ name: 'file1.txt', path: '/Users/username/Documents/MyOutputDir/file1.txt', parentPath: '/Users/username/Documents/MyOutputDir', isDirectory: false, isFile: true, isSymbolicLink: true }]
   * @type {FileEntry[]}
   */
  outputFolderFiles: FileEntry[];
  /**
   * Files that are currently synced and in good condition
   * @example
   * ['file1.txt', 'file2.txt']
   */
  filesSynced: string[];
  /**
   * Files that are in the output directory but are no longer symbolic links. They are actual files for some reason.
   * @example
   * ['file3.txt']
   */
  filesInOutputNoLongerSymLinks: string[];
  /**
   * Files that are missing from the source directory but are included in the folder items that were synced.
   * @example
   * ['file4.txt']
   */
  filesMissingFromSource: string[];
  /**
   * Files that are missing from the output directory but are included in the folder items that were synced. The symlinks are most likely pointing to non existent items
   * @example
   * ['file5.txt']
   */
  filesMissingFromOutput: string[];
  /**
   * Files that are missing from both the source and output directories but are included in the folder items that were synced. The files have been deleted from both folders.
   * @example
   * ['file6.txt']
   */
  filesMissingFromBoth: string[];
  /**
   * Files that are in the source directory but are not synced to the output directory. These are items that we can additionally sync.
   * @example
   * ['file7.txt']
   */
  filesInSourceNotSynced: string[];
  /**
   * Indicates whether all the folder items are synced.
   * @example
   * allFolderItemsSynced: true
   */
  allFolderItemsSynced: boolean;
  /**
   * The time the folder was last synced.
   * @example
   * 1632712800000
   */
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
