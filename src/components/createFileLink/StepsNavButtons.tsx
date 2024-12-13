import { FC } from 'react';

interface StepsNavHandleNextEnabledProps {
  handleNext: () => void;
  disableNextBtn: false;
}

interface StepsNavHandleNextDisabledProps {
  handleNext?: undefined;
  disableNextBtn: true;
}

interface StepsNavHandlePrevEnabledProps {
  handlePrev: () => void;
  disablePrevBtn: false;
}

interface StepsNavHandlePrevDisabledProps {
  handlePrev?: undefined;
  disablePrevBtn: true;
}

type StepsNavButtonsProps = (StepsNavHandleNextEnabledProps | StepsNavHandleNextDisabledProps) & (StepsNavHandlePrevEnabledProps | StepsNavHandlePrevDisabledProps);

export const StepsNavButtons: FC<StepsNavButtonsProps> = ({ handleNext, handlePrev, disableNextBtn, disablePrevBtn }) => {
  return (
    <div className="flex gap-8 w-full justify-center">
      <button className="btn btn-sm btn-info" onClick={handlePrev} disabled={disablePrevBtn}>
        Back
      </button>
      <button className="btn btn-sm btn-info" onClick={handleNext} disabled={disableNextBtn}>
        Next
      </button>
    </div>
  );
};
