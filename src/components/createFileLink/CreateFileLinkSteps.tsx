import { createSymLinks } from '@/utils';
import { DirEntry } from '@tauri-apps/plugin-fs';
import { FC, useState } from 'react';
import { CreateFileLinkStepsCreate } from './CreateFileLinkStepsCreate';
import { CreateFileLinkStepsOutput } from './CreateFileLinkStepsOutput';
import { CreateFileLinkStepsSelect } from './CreateFileLinkStepsSelect/CreateFileLinkStepsSelect';
import { CreateFileLinkStepsSource } from './CreateFileLinkStepsSource';

interface IStep {
  label: string;
  iniDataContent: string;
  curDataContent: string;
  completedDataContent: string;
}

export const CreateFileLinkSteps: FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [sourceValue, setSourceValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [filesToLink, setFilesToLink] = useState<DirEntry[]>();

  const changeStep = (step: 'next' | 'prev') => {
    if (step === 'next' && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else if (step === 'prev' && currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const createFileLinks = async () => {
    if (!filesToLink) {
      alert('No files have been selected to link.');
      return;
    }
    await createSymLinks(sourceValue, outputValue, filesToLink);
  };

  return (
    <>
      <ul className="steps modal-top">
        {steps.map((step, idx) => (
          <li key={idx} data-content={getDataContent(step, idx, currentStep)} className={`step w-24${idx <= currentStep ? ' step-accent' : ''}`}>
            {step.label}
          </li>
        ))}
      </ul>
      {currentStep === 0 ? (
        <CreateFileLinkStepsSource setSourceDir={setSourceValue} changeStep={changeStep} sourceDir={sourceValue} />
      ) : currentStep === 1 ? (
        <CreateFileLinkStepsOutput setOutputDir={setOutputValue} changeStep={changeStep} sourceDir={sourceValue} outputDir={outputValue} />
      ) : currentStep === 2 ? (
        <CreateFileLinkStepsSelect sourceDir={sourceValue} outputDir={outputValue} setFilesToLink={setFilesToLink} changeStep={changeStep} filesToLink={filesToLink} />
      ) : currentStep === 3 ? (
        <CreateFileLinkStepsCreate changeStep={changeStep} filesToLink={filesToLink} createFileLinks={createFileLinks} />
      ) : null}
    </>
  );
};

const steps: IStep[] = [
  {
    label: 'Source',
    iniDataContent: '?',
    curDataContent: '●',
    completedDataContent: '✓',
  },
  {
    label: 'Output',
    iniDataContent: '?',
    curDataContent: '●',
    completedDataContent: '✓',
  },
  {
    label: 'Select',
    iniDataContent: '?',
    curDataContent: '●',
    completedDataContent: '✓',
  },
  {
    label: 'Create',
    iniDataContent: '★',
    curDataContent: '★',
    completedDataContent: '★',
  },
];

const getDataContent = (step: IStep, idx: number, currentStep: number) => {
  if (currentStep < idx) {
    return step.iniDataContent;
  } else if (currentStep === idx) {
    return step.curDataContent;
  } else if (currentStep > idx) {
    return step.completedDataContent;
  }
};
