import { FileIcon } from '@/icons/FileIcon';
import { FolderIcon } from '@/icons/FolderIcon';
import { SparklesIcon } from '@/icons/SparklesIcon';
import { FC, useState } from 'react';
import { ModalTopSectionContainer } from './ModalTopSectionContainer';
import { StepsNavButtons } from './StepsNavButtons';
import { Dirent } from 'fs';

interface CreateFileLinkStepsCreateProps {
  changeStep: (step: 'next' | 'prev') => void;
  filesToLink?: Dirent[];
  createFileLinks: () => Promise<void>;
}
export const CreateFileLinkStepsCreate: FC<CreateFileLinkStepsCreateProps> = ({ changeStep, filesToLink, createFileLinks }) => {
  const [viewingSelectedFiles, setViewingSelectedFiles] = useState(false);
  const [linksCreated, setLinksCreated] = useState(false);

  const handlePrev = () => changeStep('prev');

  const handleCreateFileLinks = async () => {
    await createFileLinks();
    setLinksCreated(true);
  };

  return (
    <>
      <ModalTopSectionContainer title={!linksCreated ? 'Create Links' : 'Links Created'} description={!linksCreated ? 'Create Links for the selected files and folders.' : undefined}>
        {!linksCreated ? (
          <>
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
            <button className="btn btn-accent" onClick={handleCreateFileLinks}>
              Create Link
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <SparklesIcon className="w-16 h-16 text-accent" />
            <p className="prose">Click below to close</p>
            <form method="dialog">
              <button className="btn btn-accent">Close Modal</button>
            </form>
          </div>
        )}
      </ModalTopSectionContainer>

      {!linksCreated ? <StepsNavButtons handlePrev={handlePrev} disableNextBtn={true} disablePrevBtn={false} /> : <StepsNavButtons disableNextBtn={true} disablePrevBtn={true} />}
    </>
  );
};
