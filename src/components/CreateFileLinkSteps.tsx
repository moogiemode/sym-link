import { FC, useState } from 'react';

// interface CreateFileLinkStepsProps {}

interface IStep {
  label: string;
  iniDataContent: string;
  curDataContent: string;
  completedDataContent: string;
}

export const CreateFileLinkSteps: FC /*<CreateFileLinkStepsProps>*/ = () => {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div>
      <ul className="steps">
        {steps.map((step, index) => (
          <li key={index} data-content={getDataContent(step, currentStep)} className={getStepClasses(currentStep, index)}>
            {step.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

const getStepClasses = (currentStep: number, stepIndex: number) => {
  const stepClasses = 'step w-24';
  if (stepIndex === currentStep) {
    return stepClasses + ' step-info';
  } else if (stepIndex < currentStep) {
    return stepClasses + ' step-success';
  } else {
    return stepClasses;
  }
};

const getDataContent = (step: IStep, currentStep: number) => {
  if (currentStep === 0) {
    return step.iniDataContent;
  } else if (currentStep === steps.length) {
    return step.completedDataContent;
  } else if (currentStep > 0 && currentStep < steps.length) {
    return step.curDataContent;
  }
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
