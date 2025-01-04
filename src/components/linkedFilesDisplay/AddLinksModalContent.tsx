import React, { FC, useEffect } from 'react';
import { useSymLinkStore } from '@/store';
import { CreateFileLinkStepsSelectTableRow } from '../createFileLink/CreateFileLinkStepsSelect/CreateFileLinkStepsSelectTableRow';
import { FileEntry } from '@/types';
import { addSymLinks } from '@/utils';

interface AddLinksModalContentProps {
  dirKey: string;
  onModalClose: () => void;
}

interface ISelectibleFiles extends FileEntry {
  alreadyLinked: boolean;
  inOutputDir: boolean;
}
export const AddLinksModalContent: FC<AddLinksModalContentProps> = ({ dirKey, onModalClose }) => {
  const linkedFolderStats = useSymLinkStore(state => state.linkedFiles[dirKey]);
  const [selectibleFiles, setSelectibleFiles] = React.useState<ISelectibleFiles[]>([]);
  const [selectedFiles, setSelectedFiles] = React.useState<Set<string>>(new Set());
  const [linksCreated, setLinksCreated] = React.useState(false);
  console.log(onModalClose);

  useEffect(() => {
    const sourceFolderFiles = linkedFolderStats.sourceFolderFiles;
    const outputFolderFileNamesSet = new Set(linkedFolderStats.outputFolderFiles.map(file => file.name));
    const linkedFileNames = new Set(linkedFolderStats.linkedFiles);
    const selectibleFiles = sourceFolderFiles.map(file => {
      return {
        ...file,
        alreadyLinked: linkedFileNames.has(file.name),
        inOutputDir: outputFolderFileNamesSet.has(file.name),
      };
    });
    setSelectibleFiles(selectibleFiles);
  }, [linkedFolderStats]);

  const checkAllSelectible = (checked: boolean) => {
    const newSelectedFiles: Set<string> = checked
      ? new Set(
          Array.from(selectibleFiles)
            .filter(file => !file.alreadyLinked && !file.inOutputDir)
            .map(file => file.name),
        )
      : new Set();
    setSelectedFiles(newSelectedFiles);
  };
  const handleCheckFile = (fileName: string, checked: boolean) => {
    const newSelectedFiles = new Set(selectedFiles);
    if (checked) {
      newSelectedFiles.add(fileName);
    } else {
      newSelectedFiles.delete(fileName);
    }
    setSelectedFiles(newSelectedFiles);
  };

  const handleLinkSelectedFiles = () => {
    setLinksCreated(true);
    addSymLinks({ key: dirKey, fileNamesToLink: Array.from(selectedFiles) });
  };

  return (
    <div className="flex flex-col overflow-hidden">
      <h1 className="prose h3 text-center text-2xl mb-4">Add New Links</h1>
      <div className="overflow-x-auto w-full flex-1">
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
                    onChange={e => checkAllSelectible(e.target.checked)}
                  />
                </label>
              </th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {selectibleFiles.map(file => (
              <CreateFileLinkStepsSelectTableRow
                key={file.name}
                file={file}
                disableCheckbox={file.alreadyLinked || file.inOutputDir || linksCreated}
                onChange={checked => handleCheckFile(file.name, checked)}
                checked={selectedFiles.has(file.name) || file.alreadyLinked}
              />
            ))}
          </tbody>
        </table>
      </div>
      {linksCreated ? (
        <form method="dialog">
          <button className="btn btn-primary mt-4 w-full" onClick={() => setTimeout(() => onModalClose(), 200)}>
            Close
          </button>
        </form>
      ) : (
        <button className="btn btn-primary mt-4" onClick={handleLinkSelectedFiles} disabled={selectedFiles.size === 0}>
          Add Selected Links
        </button>
      )}
    </div>
  );
};
