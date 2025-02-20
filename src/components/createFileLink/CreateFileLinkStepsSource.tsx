import { FC, useState } from 'react';
import { CreateFileLinkDirInput } from './CreateFileLinkDirInput';
import { StepsNavButtons } from './StepsNavButtons';
import { dirExists } from '@/utils';

interface CreateFileLinkStepsSourceProps {
  setSourceDir: (value: string) => void;
  changeStep: (step: 'next' | 'prev') => void;
  sourceDir: string;
}

export const CreateFileLinkStepsSource: FC<CreateFileLinkStepsSourceProps> = ({ setSourceDir, changeStep, sourceDir }) => {
  const [value, setValue] = useState(sourceDir);

  const handleNext = async () => {
    const isValidDirectory = await dirExists(value);
    if (!isValidDirectory) {
      alert('The source directory does not exist. Please enter a valid directory.');
      return;
    }

    setSourceDir(value);
    changeStep('next');
  };

  return (
    <>
      <CreateFileLinkDirInput key="step-0" title="Source Directory" description="Enter the Source Directory that contains the files and folders you would like to link." value={value} onChange={setValue} />

      <StepsNavButtons handleNext={handleNext} disableNextBtn={false} disablePrevBtn={true} />
    </>
  );
};
