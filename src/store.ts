// import { create } from 'zustand';
// import { immer } from 'zustand/middleware/immer';
// import { LinkedFolder } from './types';

// type State = {
//   linkedFiles: Record<string, string | LinkedFolder>;
// };

// type Actions = {
//   setAllLinkedFiles: (linkedFiles: Record<string, string | LinkedFolder>) => void;
//   setLinkedFile: (linkedFile: string | LinkedFolder) => void;
// };

// export const useSymLinkStore = create<State & Actions>()(
//   immer(set => ({
//     linkedFiles: {},
//     setAllLinkedFiles: linkedFiles => {
//       set(state => {
//         state.linkedFiles = linkedFiles;
//       });
//     },
//     setLinkedFile: linkedFile => {
//       set(state => {
//         state.linkedFiles[typeof linkedFile === 'string' ? linkedFile : linkedFile.dirKey] = linkedFile;
//       });
//     },
//   })),
// );
