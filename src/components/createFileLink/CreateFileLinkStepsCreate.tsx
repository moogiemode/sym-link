import { FileIcon } from '@/icons/FileIcon';
import { FolderIcon } from '@/icons/FolderIcon';
import { DirEntry } from '@tauri-apps/plugin-fs';
import { FC, useState } from 'react';
import { ModalTopSectionContainer } from './ModalTopSectionContainer';
import { StepsNavButtons } from './StepsNavButtons';

interface CreateFileLinkStepsCreateProps {
  changeStep: (step: 'next' | 'prev') => void;
  filesToLink?: DirEntry[];
  createFileLinks: () => Promise<void>;
}
export const CreateFileLinkStepsCreate: FC<CreateFileLinkStepsCreateProps> = ({ changeStep, filesToLink, createFileLinks }) => {
  const [viewingSelectedFiles, setViewingSelectedFiles] = useState(false);

  const handlePrev = () => changeStep('prev');

  return (
    <>
      <ModalTopSectionContainer title="Create Links" description="Create Links for the selected files and folders.">
        <div className={`collapse collapse-arrow${viewingSelectedFiles ? ' min-h-[130px]' : ''}`}>
          <input type="checkbox" onChange={e => setViewingSelectedFiles(e.target.checked)} />
          <div className="collapse-title font-medium bg-base-200">{viewingSelectedFiles ? 'Hide' : 'View'} Selected Files</div>
          <div className="collapse-content flex flex-col justify-center items-start min-h-[130px]">
            <div className="overflow-x-auto w-full">
              <table className="table table-xs table-zebra table-pin-rows">
                <tbody>
                  {filesToLink?.map(file => (
                    <tr key={file.name}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="avatar">{file.isDirectory ? <FolderIcon className="size-5" /> : <FileIcon className="size-5" />}</div>
                          <div>
                            <div className="font-bold text-ellipsis whitespace-nowrap">{file.name}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <button className="btn btn-accent" onClick={createFileLinks}>
          Create Link
        </button>
      </ModalTopSectionContainer>

      <StepsNavButtons handlePrev={handlePrev} disableNextBtn={true} disablePrevBtn={false} />
    </>
  );
};
