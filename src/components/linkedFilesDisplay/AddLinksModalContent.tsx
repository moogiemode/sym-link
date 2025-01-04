import React, { FC } from 'react';
import { CreateFileLinkStepsSelectTable } from '../createFileLink/CreateFileLinkStepsSelect/CreateFileLinkStepsSelectTable';

interface AddLinksModalContentProps {
  sourceDirPath: string;
  outputDirPath: string;
}
export const AddLinksModalContent: FC<AddLinksModalContentProps> = ({ sourceDirPath, outputDirPath }) => {
  // console.log('sourceDirPath:', sourceDirPath);
  return (
    <div className="overflow-x-auto w-full">
      {/* <CreateFileLinkStepsSelectTable
        foldersContent={undefined}
        selectedFiles={undefined}
        handleCheckFile={function (fileName: string, checked: boolean): void {
          throw new Error('Function not implemented.');
        }}
        handleCheckAll={function (selectAll: boolean): void {
          throw new Error('Function not implemented.');
        }}
        headerCheckboxStatus={'checked'}
      /> */}
    OPEN</div>
  );
};
