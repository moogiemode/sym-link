import { DirEntry } from '@tauri-apps/plugin-fs';

export interface ISourceOutputFoldersContent {
  sourceDirFiles: Record<string, DirEntry>;
  outputDirFiles: Record<string, DirEntry>;
}

export interface IIconProps {
  className?: React.SVGProps<SVGSVGElement>['className'];
}

export interface LinkedFolder {
  dirKey: string;
  sourceDir: string;
  outputDir: string;
  filesSynced: string[];
  filesInOutputNoLongerSymLinks: string[];
  filesMissingFromSource: string[];
  filesMissingFromOutput: string[];
  filesMissingFromBoth: string[];
  allFolderItemsSynced: boolean;
  timeSynced: number;
}
