import { ISourceOutputFoldersContent } from '@/types';
import { FC, useEffect } from 'react';
import { CreateFileLinkStepsSelectTableRow } from './CreateFileLinkStepsSelectTableRow';

interface CreateFileLinkStepsSelectTableProps {
  foldersContent: ISourceOutputFoldersContent;
  selectedFiles: Set<string>;
  handleCheckFile: (fileName: string, checked: boolean) => void;
  handleCheckAll: (selectAll: boolean) => void;
  headerCheckboxStatus: 'checked' | 'unchecked' | 'indeterminate';
}

export const CreateFileLinkStepsSelectTable: FC<CreateFileLinkStepsSelectTableProps> = ({ foldersContent, selectedFiles, handleCheckFile, handleCheckAll, headerCheckboxStatus }) => {
  useEffect(() => {
    const checkbox = document.getElementById('checkbox-select-table-header') as HTMLInputElement | null;
    if (checkbox) {
      checkbox.checked = headerCheckboxStatus === 'checked';
      checkbox.indeterminate = headerCheckboxStatus === 'indeterminate';
    }
  }, [headerCheckboxStatus]);

  return (
    <div className="overflow-x-auto w-full">
      <table className="table table-xs table-zebra table-pin-rows">
        <thead>
          <tr>
            <th className="w-8">
              <label>
                <input
                  type="checkbox"
                  id="checkbox-select-table-header"
                  className="checkbox checkbox-sm checked:checkbox-accent indeterminate:checkbox-warning "
                  defaultChecked={false}
                  onChange={e => handleCheckAll(e.target.checked)}
                />
              </label>
            </th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(foldersContent.sourceDirFiles).map(file => (
            <CreateFileLinkStepsSelectTableRow
              key={file.name}
              file={file}
              disableCheckbox={Boolean(foldersContent.outputDirFiles[file.name])}
              onChange={checked => handleCheckFile(file.name, checked)}
              checked={selectedFiles.has(file.name)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
