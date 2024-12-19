import { CreateFileLinkButton } from './components/createFileLink/CreateFileLinkButton';
import { LinkedFilesDisplay } from './components/linkedFilesDisplay/LinkedFilesDisplay.tsx';
import './init.ts';

function App() {
  return (
    <>
      <CreateFileLinkButton />
      <LinkedFilesDisplay />
    </>
  );
}

export default App;
