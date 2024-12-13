import { ISourceOutputFoldersContent } from '@/types';
import { FC } from 'react';
import { CreateFileLinkStepsSelectTableRow } from './CreateFileLinkStepsSelectTableRow';

interface CreateFileLinkStepsSelectTableProps {
  foldersContent: ISourceOutputFoldersContent;
  selectedFiles: Set<string>;
  setSelectedFiles: (files: Set<string>) => void;
}

export const CreateFileLinkStepsSelectTable: FC<CreateFileLinkStepsSelectTableProps> = ({ foldersContent, selectedFiles, setSelectedFiles }) => {
  const handleSelectAll = (selectAll: boolean) => {
    setSelectedFiles(selectAll ? new Set(Object.keys(foldersContent.sourceDirFiles).filter(f => !foldersContent.outputDirFiles[f])) : new Set());
  };

  const handleSelect = (fileName: string, checked: boolean) => {
    const newSet = new Set(selectedFiles);
    if (checked) {
      newSet.add(fileName);
    } else {
      newSet.delete(fileName);
    }
    setSelectedFiles(newSet);
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="table table-xs table-zebra table-pin-rows">
        <thead>
          <tr>
            <th className="w-8">
              <label>
                <input type="checkbox" className="checkbox checkbox-sm checked:checkbox-accent" defaultChecked={selectedFiles.size > 0} onChange={e => handleSelectAll(e.target.checked)} />
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
              onChange={checked => handleSelect(file.name, checked)}
              checked={selectedFiles.has(file.name)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
