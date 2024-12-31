// import { ISourceOutputFoldersContent } from '@/types';
// import { arrayToObject, removeFilesToIgnore } from '@/utils';
// import { DirEntry, readDir } from '@tauri-apps/plugin-fs';
// import { FC, useEffect, useRef, useState } from 'react';
// import { ModalTopSectionContainer } from '../ModalTopSectionContainer';
// import { StepsNavButtons } from '../StepsNavButtons';
// import { CreateFileLinkStepsSelectTable } from './CreateFileLinkStepsSelectTable';

// interface CreateFileLinkStepsSelectProps {
//   sourceDir: string;
//   outputDir: string;
//   filesToLink?: DirEntry[];
//   setFilesToLink: (files: DirEntry[]) => void;
//   changeStep: (step: 'next' | 'prev') => void;
// }

// export const CreateFileLinkStepsSelect: FC<CreateFileLinkStepsSelectProps> = ({ sourceDir, outputDir, changeStep, setFilesToLink, filesToLink }) => {
//   const [directoryFiles, setDirectoryFiles] = useState<ISourceOutputFoldersContent>({ sourceDirFiles: {}, outputDirFiles: {} });
//   const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set(filesToLink?.map(f => f.name) || []));
//   const [loadingFiles, setLoadingFiles] = useState(true);
//   const selectableFilesCount = useRef(0);
//   const initialFilesToLink = useRef(Boolean(filesToLink));

//   useEffect(() => {
//     const readDirectories = async () => {
//       const sourceFiles = readDir(sourceDir);
//       const outputFiles = readDir(outputDir);
//       Promise.all([sourceFiles, outputFiles]).then(values => {
//         const dirFiles = {
//           sourceDirFiles: arrayToObject(
//             removeFilesToIgnore(values[0]),
//             'name',
//           ),
//           outputDirFiles: arrayToObject(
//             removeFilesToIgnore(values[1]),
//             'name',
//           ),
//         };
//         setDirectoryFiles(dirFiles);

//         const selectableFiles = new Set(Object.keys(dirFiles.sourceDirFiles).filter(f => !dirFiles.outputDirFiles[f]));
//         selectableFilesCount.current = selectableFiles.size;
//         if (!initialFilesToLink.current) {
//           setSelectedFiles(selectableFiles);
//         }
//       });
//       setLoadingFiles(false);
//     };

//     readDirectories();
//   }, [sourceDir, outputDir]);

//   const handleCheckFile = (fileName: string, checked: boolean) => {
//     const newSet = new Set(selectedFiles);
//     if (checked) {
//       newSet.add(fileName);
//     } else {
//       newSet.delete(fileName);
//     }
//     setSelectedFiles(newSet);
//   };

//   const handleCheckAll = (selectAll: boolean) => setSelectedFiles(selectAll ? new Set(Object.keys(directoryFiles.sourceDirFiles).filter(f => !directoryFiles.outputDirFiles[f])) : new Set());

//   const handleNext = () => {
//     if (selectedFiles.size === 0) {
//       alert('Please select at least one file to link.');
//       return;
//     }
//     setFilesToLink(Array.from(selectedFiles).map(fName => directoryFiles.sourceDirFiles[fName]));
//     changeStep('next');
//   };

//   const handlePrev = () => {
//     setFilesToLink(Array.from(selectedFiles).map(fName => directoryFiles.sourceDirFiles[fName]));
//     changeStep('prev');
//   };

//   return (
//     <>
//       <ModalTopSectionContainer title="Select Files and Folders" description="Select the files and folders you'd like to link.">
//         {loadingFiles ? (
//           <p>Loading...</p>
//         ) : (
//           <CreateFileLinkStepsSelectTable
//             headerCheckboxStatus={selectedFiles.size === 0 ? 'unchecked' : selectedFiles.size === selectableFilesCount.current ? 'checked' : 'indeterminate'}
//             foldersContent={directoryFiles}
//             selectedFiles={selectedFiles}
//             handleCheckFile={handleCheckFile}
//             handleCheckAll={handleCheckAll}
//           />
//         )}
//       </ModalTopSectionContainer>

//       <StepsNavButtons handlePrev={handlePrev} handleNext={handleNext} disableNextBtn={false} disablePrevBtn={false} />
//     </>
//   );
// };
