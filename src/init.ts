import { getAllLinkedFoldersFromSettings } from './settings';
import { useSymLinkStore } from './store';
import { LinkedFolder } from './types';

const init = async () => {
  await getAllLinkedFoldersFromSettings()
    .then(folders => {
      // if (!folders) return folders;
      return folders.reduce(
        (acc, folder) => {
          acc[folder.dirKey] = folder;
          return acc;
        },
        {} as Record<string, LinkedFolder>,
      );
    })
    .then(linkedFolders => {
      if (!linkedFolders) return;
      useSymLinkStore.getState().setAllLinkedFiles(linkedFolders);
    });
};

init();