// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron/renderer';
import { Dirent } from 'fs';
import { ISymLinkedSettingsFolder, ISymLinkSettings } from './types';

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title: string) => ipcRenderer.send('set-title', title),

  pathJoin: (...paths: string[]) => ipcRenderer.invoke('path-join', ...paths),
  pathResolve: (...paths: string[]) => ipcRenderer.invoke('path-resolve', ...paths),
  pathDirname: (path: string) => ipcRenderer.invoke('path-dirname', path),
  pathBasename: (path: string) => ipcRenderer.invoke('path-basename', path),

  openDialog: () => ipcRenderer.invoke('open-dialog'),
  readDirectory: (dirPath: string) => ipcRenderer.invoke('read-directory', dirPath),
  readLink: (linkPath: string) => ipcRenderer.invoke('read-link', linkPath),

  symLink: (sourcePath: string, linkPath: string) => ipcRenderer.invoke('sym-link', sourcePath, linkPath),
  ensureDirectory: (dirPath: string, allowCreate?: boolean) => ipcRenderer.invoke('ensure-directory', dirPath, allowCreate),

  saveSettings: (key: string, value: unknown) => ipcRenderer.invoke('save-settings', key, value),
  getSettings: (key: string) => ipcRenderer.invoke('get-settings', key),
  saveLinkInfo: (linkKey: string, linkValue: ISymLinkedSettingsFolder) => ipcRenderer.invoke('save-link-info', linkKey, linkValue),
  getLinkInfo: (linkKey: string) => ipcRenderer.invoke('get-link-info', linkKey),
  deleteLinkInfo: (linkKey: string, linkFileNames?: string[]) => ipcRenderer.invoke('delete-link-info', linkKey, linkFileNames),
  clearSettings: () => ipcRenderer.invoke('clear-settings'),
});

// Add this type declaration in your renderer TypeScript file
// or in a separate .d.ts file
declare global {
  interface Window {
    electronAPI: {
      setTitle: (title: string) => void;

      pathJoin: (...paths: string[]) => Promise<string>;
      pathResolve: (...paths: string[]) => Promise<string>;
      pathDirname: (path: string) => Promise<string>;
      pathBasename: (path: string) => Promise<string>;

      openDialog: () => Promise<string>;
      readDirectory: (dirPath: string) => Promise<Dirent[]>;
      readLink: (linkPath: string) => Promise<string>;

      symLink: (sourcePath: string, linkPath: string) => Promise<void>;
      ensureDirectory: (dirPath: string, allowCreate?: boolean) => Promise<boolean>;

      saveSettings: <K extends keyof ISymLinkSettings>(key: K, value: ISymLinkSettings[K]) => Promise<void>;
      getSettings: <K extends keyof ISymLinkSettings>(key: K) => Promise<ISymLinkSettings[K] | null>;
      saveLinkInfo: (linkKey: string, linkValue: ISymLinkedSettingsFolder) => Promise<ISymLinkedSettingsFolder>;
      getLinkInfo: (linkKey: string) => Promise<ISymLinkedSettingsFolder | null>;
      deleteLinkInfo: (linkKey: string, linkFileNames?: string[]) => Promise<string | ISymLinkedSettingsFolder>;

      clearSettings: () => Promise<void>;
    };
  }
}
