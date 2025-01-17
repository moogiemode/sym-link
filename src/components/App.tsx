import { CreateFileLinkButton } from './createFileLink/CreateFileLinkButton';
import { LinkedFilesDisplay } from './linkedFilesDisplay/LinkedFilesDisplay';

export const App = () => {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center gap-4'>
      <CreateFileLinkButton />
      <LinkedFilesDisplay />
    </div>
  );
};
