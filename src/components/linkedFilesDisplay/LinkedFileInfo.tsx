import { ArrowRightIcon } from '@/icons/ArrowRightIcon';
import { LinkIcon } from '@/icons/LinkIcon';
import { LinkedFolder } from '@/types';
import { FC } from 'react';

export const LinkedFileInfo: FC<{ linkedFile: LinkedFolder | string }> = ({ linkedFile }) => {
  const { dirKey, sourceDirName, outputDirName, sourceDirPath, outputDirPath, filesSynced, filesMissingFromSource, filesMissingFromOutput, filesMissingFromBoth, filesInOutputNoLongerSymLinks, timeSynced } =
    typeof linkedFile === 'string' ? {} : linkedFile;

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
        <div className="flex items-center gap-3">
          <div className="font-bold">{sourceDirName}</div>
          <ArrowRightIcon className="size-6" />
          <div className="font-bold">{outputDirName}</div>
        </div>
        <div className="text-sm opacity-50">{`${sourceDirPath} → ${outputDirPath}`}</div>
        <div>
          <div className="flex items-end">
            <div className="text-sm opacity-75">Last Synced On: {new Date(timeSynced).toLocaleString()}</div>
            <div className="text-xs opacity-50">{outputDirPath}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
