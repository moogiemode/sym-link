import { FC, ReactNode, useState } from 'react';
import { CreateFileLinkDirInput } from './CreateFileLinkDirInput';

// interface CreateFileLinkStepsProps {}

interface IStep {
  label: string;
  iniDataContent: string;
  curDataContent: string;
  completedDataContent: string;
  element: ReactNode;
}

export const CreateFileLinkSteps: FC /*<CreateFileLinkStepsProps>*/ = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [sourceValue, setSourceValue] = useState('');
  const [outputValue, setOutputValue] = useState('');

  // const stepJSX = [
  //   <CreateFileLinkDirInput key="step-0" title="Source Directory" description="Enter the Source Directory that contains the files and folders you would like to link." value={sourceValue} onChange={setSourceValue} />,
  //   <CreateFileLinkDirInput key="step-1" title="Output Directory" description="Enter the Output Directory where you would like to the linked files and folders to appear." value={outputValue} onChange={setOutputValue} />,
  // ];

  const steps: IStep[] = [
    {
      label: 'Source',
      iniDataContent: '?',
      curDataContent: '●',
      completedDataContent: '✓',
      element: (
        <CreateFileLinkDirInput key="step-0" title="Source Directory" description="Enter the Source Directory that contains the files and folders you would like to link." value={sourceValue} onChange={setSourceValue} />
      ),
    },
    {
      label: 'Output',
      iniDataContent: '?',
      curDataContent: '●',
      completedDataContent: '✓',
      element: (
        <CreateFileLinkDirInput
          key="step-1"
          title="Output Directory"
          description="Enter the Output Directory where you would like to the linked files and folders to appear."
          value={outputValue}
          onChange={setOutputValue}
        />
      ),
    },
    {
      label: 'Select',
      iniDataContent: '?',
      curDataContent: '●',
      completedDataContent: '✓',
      element: <div />,
    },
    {
      label: 'Create',
      iniDataContent: '★',
      curDataContent: '★',
      completedDataContent: '★',
      element: <div />,
    },
  ];

  const getDataContent = (step: IStep, idx: number) => {
    if (currentStep < idx) {
      return step.iniDataContent;
    } else if (currentStep === idx) {
      return step.curDataContent;
    } else if (currentStep > idx) {
      return step.completedDataContent;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className='flex flex-col gap-8'>
      <ul className="steps">
        {steps.map((step, idx) => (
          <li key={idx} data-content={getDataContent(step, idx)} className={`step w-24${idx <= currentStep ? ' step-accent' : ''}`}>
            {step.label}
          </li>
        ))}
      </ul>
      {steps[currentStep].element}
      <div>
        <button className="btn btn-sm btn-info" onClick={handlePrev}>
          Back
        </button>
        <button className="btn btn-sm btn-info" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};
