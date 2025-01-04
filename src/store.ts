import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { LinkedFolder } from './types';

interface State {
  linkedFiles: Record<string, LinkedFolder>;
}

interface Actions {
  setAllLinkedFiles: (linkedFiles: Record<string, LinkedFolder>) => void;
  setLinkedFile: (linkedFile: LinkedFolder) => void;
  deleteLinkedFile: (dirKey: string) => void;
}

export const useSymLinkStore = create<State & Actions>()(
  immer(set => ({
    linkedFiles: {},
    setAllLinkedFiles: linkedFiles => {
      set(state => {
        state.linkedFiles = linkedFiles;
      });
    },
    setLinkedFile: linkedFile => {
      set(state => {
        state.linkedFiles[linkedFile.dirKey] = linkedFile;
      });
    },
    deleteLinkedFile: dirKey => {
      set(state => {
        delete state.linkedFiles[dirKey];
      });
    },
  })),
);
