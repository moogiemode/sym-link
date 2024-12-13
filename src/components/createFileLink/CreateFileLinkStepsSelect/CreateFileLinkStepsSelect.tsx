import { ISourceOutputFoldersContent } from '@/types';
import { arrayToObject } from '@/utils';
import { readDir } from '@tauri-apps/plugin-fs';
import { FC, useEffect, useState } from 'react';
import { StepsNavButtons } from '../StepsNavButtons';
import { CreateFileLinkStepsSelectTable } from './CreateFileLinkStepsSelectTable';

interface CreateFileLinkStepsSelectProps {
  sourceDir: string;
  outputDir: string;
  selectedFiles: string[];
  setSelectedFiles: (files: string[]) => void;
  changeStep: (step: 'next' | 'prev') => void;
}

export const CreateFileLinkStepsSelect: FC<CreateFileLinkStepsSelectProps> = ({ sourceDir, outputDir, changeStep }) => {
  const [directoryFiles, setDirectoryFiles] = useState<ISourceOutputFoldersContent>({ sourceDirFiles: {}, outputDirFiles: {} });
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    const readDirectories = async () => {
      const sourceFiles = readDir(sourceDir);
      const outputFiles = readDir(outputDir);
      Promise.all([sourceFiles, outputFiles]).then(values => {
        const dirFiles = { sourceDirFiles: arrayToObject(values[0], 'name'), outputDirFiles: arrayToObject(values[1], 'name') };
        const selectedFiles = new Set(Object.keys(dirFiles.sourceDirFiles).filter(f => !dirFiles.outputDirFiles[f]));
        setDirectoryFiles(dirFiles);
        setSelectedFiles(selectedFiles);
      });
    };

    readDirectories();
  }, [sourceDir, outputDir]);

  const handleNext = () => {
    if (selectedFiles.size === 0) {
      alert('Please select at least one file to link.');
      return;
    }
    changeStep('next');
  };

  const handlePrev = () => {
    changeStep('prev');
  };

  return (
    <>
      <div className="flex flex-col gap-4 justify-center items-center">
        <h3 className="font-bold text-lg prose">Select Files and Folders</h3>
        <p className="prose">Select the files and folders you'd like to link.</p>

        <CreateFileLinkStepsSelectTable foldersContent={directoryFiles} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
      </div>

      <StepsNavButtons handlePrev={handlePrev} handleNext={handleNext} disableNextBtn={false} disablePrevBtn={false} />
    </>
  );
};
