import { DirEntry } from '@tauri-apps/plugin-fs';

export interface ICreateLinkModalState {
  open: boolean;
  inputDir: string;
  outputDir: string;
}

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
  linkedFileNames: string[];
  filesInOutputNoLongerSymLinks: string[];
  filesMissingFromSource: string[];
  filesMissingFromOutput: string[];
  filesMissingFromBoth: string[];
  fullySynced: boolean;
  timeSynced: number;
}
