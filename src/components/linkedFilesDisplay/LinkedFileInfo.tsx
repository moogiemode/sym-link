import { ArrowRightIcon } from '@/icons/ArrowRightIcon';
import { LinkIcon } from '@/icons/LinkIcon';
import { LinkedFolder } from '@/types';
import { FC } from 'react';

export const LinkedFileInfo: FC<{ linkedFile: LinkedFolder | string }> = ({ linkedFile }) => {
  const {
    dirKey,
    linkedFiles,
    sourceDirName,
    outputDirName,
    sourceDirPath,
    outputDirPath,
    allFolderItemsSynced,
    filesSynced,
    filesMissingFromSource,
    filesMissingFromOutput,
    filesMissingFromBoth,
    filesInOutputNoLongerSymLinks,
    timeSynced,
  } = typeof linkedFile === 'string' ? {} : linkedFile;

  console.log(linkedFile);

  const syncStatus = filesSynced.length === linkedFiles.length ? {className: 'text-success', text: 'All Good'} : filesSynced.length === 0 ? {className: 'text-error', text: 'All Synced Files are Missing'} : {className: 'text-warning', text: 'Some Files are Missing'};
  return (
    <div className="flex items-center bg-base-200 gap-3 p-2 rounded-md">
      <div className="avatar size-14 bg-base-300 mask mask-squircle">
        <div>
          <div className="flex justify-center items-center h-full w-full">
            <LinkIcon />
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="font-bold">{sourceDirName}</div>
            <ArrowRightIcon className="size-6" />
            <div className="font-bold">{outputDirName}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`badge badge-primary ${allFolderItemsSynced ? '' : 'badge-outline'}`}>{allFolderItemsSynced ? 'full' : 'partial'}</div>
            <div className="badge badge-accent">{linkedFiles.length}</div>
          </div>
        </div>
        <div className="text-sm opacity-75">{`${sourceDirPath} → ${outputDirPath}`}</div>
        <div className="flex justify-between gap-3 items-center">
          <div className="text-sm opacity-40">Last Synced: {new Date(timeSynced).toLocaleString()}</div>
          <div className={`text-xs opacity-50 ${syncStatus.className}`}>Sync Status: {syncStatus.text}</div>
        </div>
      </div>
    </div>
  );
};
