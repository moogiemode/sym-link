import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ICreateLinkModalState } from './types';

type State = {
  createLinkModalState: ICreateLinkModalState;
};

type Actions = {
  openCreateLinkModal: () => void;
  closeCreateLinkModal: () => void;
  resetCreateLinkModalState: () => void;
};

const initialCreateLinkModalState: ICreateLinkModalState = {
  open: false,
  inputDir: '',
  outputDir: '',
};

export const useCountStore = create<State & Actions>()(
  immer(set => ({
    createLinkModalState: initialCreateLinkModalState,
    openCreateLinkModal: () => {
      set(state => {
        state.createLinkModalState.open = true;
      });
    },
    closeCreateLinkModal: () => {
      set(state => {
        state.createLinkModalState.open = false;
      });
    },
    resetCreateLinkModalState: () => {
      set(state => {
        state.createLinkModalState = initialCreateLinkModalState;
      });
    },
  })),
);
