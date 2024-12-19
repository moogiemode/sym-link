import { ArrowRightIcon } from '@/icons/ArrowRightIcon';

export const LinkedFileInfo = () => {
  const date = new Date();
  return (
    <div className="flex items-center gap-3">
      <div className="avatar size-14 bg-success mask mask-squircle">
        <div>
          <div className="text-xl font-bold flex justify-center items-center h-full w-full">A➤E</div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-3">
          <div className="font-bold">My Source Folder</div>
          <ArrowRightIcon className="size-6" />
          <div className="font-bold">My Output Folder</div>
        </div>
        <div className="text-sm opacity-50">{'C:\\Users\\YourName\\Documents\\Your Fol der → C:\\Users\\YourName\\Documents\\YourFolder'}</div>
        <div>
          <div className="flex items-end">
            <div className="text-sm opacity-75">Last Synced On: </div>
            <div className="text-xs opacity-50">{date.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
