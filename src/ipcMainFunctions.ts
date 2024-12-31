import { BrowserWindow, IpcMainEvent, dialog } from 'electron';

export const setTitle: (event: IpcMainEvent, title: string) => void = (event, title) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win.setTitle(title);
};

export const openDialog: () => Promise<string> = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'], //only directories can be selected
  });

  if (!canceled) {
    return filePaths[0];
  }
};
