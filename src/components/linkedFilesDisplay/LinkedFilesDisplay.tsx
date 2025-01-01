import { useSymLinkStore } from '@/store';
import { LinkedFileInfo } from './LinkedFileInfo';

export const LinkedFilesDisplay = () => {
  const linkedFiles = useSymLinkStore(state => state.linkedFiles);
  return (
    <div className="flex flex-1 flex-col w-full overflow-y-auto">
      {Object.values(linkedFiles).map(linkedFile => (
        <LinkedFileInfo key={typeof linkedFile === 'string' ? linkedFile : linkedFile.dirKey} linkedFile={linkedFile} />
      ))}
    </div>
  );
};
