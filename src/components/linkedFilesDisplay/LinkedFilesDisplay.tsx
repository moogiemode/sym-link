import { useSymLinkStore } from '@/store';
import { LinkedFileInfo } from './LinkedFileInfo';

export const LinkedFilesDisplay = () => {
  const linkedFiles = useSymLinkStore(state => state.linkedFiles);
  const linkedFilesArr = Object.values(linkedFiles);
  return (
    <div className="flex flex-1 flex-col w-full overflow-y-auto">
      <div className="divider text-lg font-medium">Linked Files</div>
      {linkedFilesArr.length === 0 ? (
        <div className="text-center">It seems you have no linked files. Click the button above to create one</div>
      ) : (
        linkedFilesArr.map(linkedFile => <LinkedFileInfo key={typeof linkedFile === 'string' ? linkedFile : linkedFile.dirKey} linkedFile={linkedFile} />)
      )}
    </div>
  );
};
