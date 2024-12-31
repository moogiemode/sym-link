// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron/renderer';

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title: string) => ipcRenderer.send('set-title', title),
  openDialog: () => ipcRenderer.invoke('open-dialog'),
});

// Add this type declaration in your renderer TypeScript file
// or in a separate .d.ts file
declare global {
  interface Window {
    electronAPI: {
      setTitle: (title: string) => void;
      openDialog: () => Promise<string>;
    };
  }
}
