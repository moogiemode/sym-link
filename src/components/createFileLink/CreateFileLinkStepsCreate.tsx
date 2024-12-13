import { FC } from 'react';
import { StepsNavButtons } from './StepsNavButtons';

interface CreateFileLinkStepsCreateProps {
  changeStep: (step: 'next' | 'prev') => void;
}
export const CreateFileLinkStepsCreate: FC<CreateFileLinkStepsCreateProps> = ({ changeStep }) => {
  const handleNext = () => {
    changeStep('next');
  };

  const handlePrev = () => {
    changeStep('prev');
  };
  return (
    <>
      <div>CreateFileLinkCreateStep</div>

      <StepsNavButtons handleNext={handleNext} handlePrev={handlePrev} disableNextBtn={false} disablePrevBtn={false} />
    </>
  );
};
