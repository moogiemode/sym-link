import { exists } from '@tauri-apps/plugin-fs';
import { FC, useState } from 'react';
import { CreateFileLinkDirInput } from './CreateFileLinkDirInput';
import { StepsNavButtons } from './StepsNavButtons';

interface CreateFileLinkStepsOutputProps {
  sourceDir: string;
  setOutputDir: (value: string) => void;
  changeStep: (step: 'next' | 'prev') => void;
}

export const CreateFileLinkStepsOutput: FC<CreateFileLinkStepsOutputProps> = ({ setOutputDir, changeStep, sourceDir }) => {
  const [value, setValue] = useState('');

  const handleNext = async () => {
    if (value === sourceDir) {
      alert('The output directory cannot be the same as the source directory. Please enter a different directory.');
      return;
    }

    const dirExists = await exists(value);
    if (!dirExists) {
      alert('The output directory does not exist. Please enter a valid directory.');
      return;
    }
    
    setOutputDir(value);
    changeStep('next');
  };

  const handlePrev = () => {
    changeStep('prev');
  };

  return (
    <>
      <CreateFileLinkDirInput key="step-1" title="Output Directory" description="Enter the Output Directory where you would like to the linked files and folders to appear." value={value} onChange={setValue} />
      <StepsNavButtons handlePrev={handlePrev} handleNext={handleNext} disableNextBtn={false} disablePrevBtn={false} />
    </>
  );
};
