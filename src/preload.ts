// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron/renderer';
import { Dirent } from 'fs';

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title: string) => ipcRenderer.send('set-title', title),
  openDialog: () => ipcRenderer.invoke('open-dialog'),

  readDirectory: (dirPath: string) => ipcRenderer.invoke('read-directory', dirPath),

  saveSettings: (key: string, value: unknown) => ipcRenderer.invoke('save-settings', key, value),
  loadSettings: () => ipcRenderer.invoke('get-settings'),
});

// Add this type declaration in your renderer TypeScript file
// or in a separate .d.ts file
declare global {
  interface Window {
    electronAPI: {
      setTitle: (title: string) => void;
      openDialog: () => Promise<string>;

      readDirectory: (dirPath: string) => Promise<Dirent[]>;
      saveSettings: (key: string, value: unknown) => Promise<void>;
      loadSettings: () => Promise<Record<string, unknown> | null>;
    };
  }
}
