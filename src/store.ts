import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { LinkedFolder } from './types';

interface State {
  linkedFiles: Record<string, string | LinkedFolder>;
}

interface Actions {
  setAllLinkedFiles: (linkedFiles: Record<string, string | LinkedFolder>) => void;
  setLinkedFile: (linkedFile: string | LinkedFolder) => void;
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
        state.linkedFiles[typeof linkedFile === 'string' ? linkedFile : linkedFile.dirKey] = linkedFile;
      });
    },
  })),
);
